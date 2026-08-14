"""Trains the 3-channel (NO2+SO2+VIIRS) power-plant detector.

Ported near-verbatim from the source research repo's train_3channel.py,
mirroring how train_2channel.py was already ported for this repo. Same
architecture as app/inference/model.py's _TorchCnnScorer.Detector3 -
loading a state_dict trained here into that class must match exactly.

Honesty note, since this matters for anyone actually running this script:
the weights this repo currently ships (weights/detector3.pt, copied
directly from the research repo - see ../weights/README.md's Provenance
section) were NOT produced by this simple script. They came from that
repo's much more rigorous methodology: a facility-level train/test split
(not the plain random 80/20 split below) plus an exhaustive leave-one-
facility-out (LOFO) evaluation across 21 facilities, which is what
produced the reported 69.1% recall figure. This script exists for
from-scratch reproducibility using this repo's own simpler existing
training convention (matching train_2channel.py's approach) - re-running
it will NOT reproduce the 69.1% LOFO figure, only a single random-split
accuracy number, which the research repo's own history (RESEARCH_PAPER.md
Sec 5.1/6 there) showed can substantially overstate real generalization.
For the actual rigorous training/evaluation methodology, use the research
repo's own train_3channel.py / lofo_track_a.py directly.

Usage (from ml-service/, training venv active - see training/README.md):
    python -m training.train_3channel
"""
import glob
import pathlib
import random

import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset, random_split

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
WEIGHTS_DIR = pathlib.Path(__file__).resolve().parent.parent / "weights"


class Detector3(nn.Module):
    """Must match app/inference/model.py's _TorchCnnScorer.Detector3 exactly."""

    def __init__(self) -> None:
        super().__init__()
        self.net = nn.Sequential(
            nn.Conv2d(3, 16, 3, padding=1),
            nn.BatchNorm2d(16),
            nn.SiLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(16, 32, 3, padding=1),
            nn.BatchNorm2d(32),
            nn.SiLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 64, 3, padding=1),
            nn.BatchNorm2d(64),
            nn.SiLU(),
            nn.AdaptiveAvgPool2d(1),
            nn.Flatten(),
            nn.Dropout(0.3),
            nn.Linear(64, 2),
        )

    def forward(self, x):
        return self.net(x)


def load_folder(path: str, label: int) -> tuple[list, list]:
    X, y = [], []
    for f in sorted(glob.glob(f"{path}/*.npy")):
        arr = np.load(f).astype(np.float32)  # shape (3, 64, 64)
        X.append(arr)
        y.append(label)
    return X, y


def run(X_list: list, y_list: list, tag: str, epochs: int = 30) -> float:
    X = np.stack(X_list)  # (N, 3, 64, 64)
    y = np.array(y_list, dtype=np.int64)
    for c in range(3):
        mean, std = X[:, c].mean(), X[:, c].std() + 1e-12
        X[:, c] = (X[:, c] - mean) / std
    X_t, y_t = torch.tensor(X), torch.tensor(y)
    dataset = TensorDataset(X_t, y_t)
    n_test = max(1, int(0.2 * len(dataset)))
    n_train = len(dataset) - n_test
    train_ds, test_ds = random_split(
        dataset, [n_train, n_test], generator=torch.Generator().manual_seed(0)
    )
    train_dl = DataLoader(train_ds, batch_size=16, shuffle=True)
    test_dl = DataLoader(test_ds, batch_size=16)

    model = Detector3().to(DEVICE)
    opt = torch.optim.AdamW(model.parameters(), lr=3e-4)
    loss_fn = nn.CrossEntropyLoss()
    for _ in range(epochs):
        model.train()
        for xb, yb in train_dl:
            xb, yb = xb.to(DEVICE), yb.to(DEVICE)
            opt.zero_grad()
            loss_fn(model(xb), yb).backward()
            opt.step()

    model.eval()
    correct = total = tp = tn = fp = fn = 0
    with torch.no_grad():
        for xb, yb in test_dl:
            xb, yb = xb.to(DEVICE), yb.to(DEVICE)
            pred = model(xb).argmax(1)
            correct += (pred == yb).sum().item()
            total += yb.size(0)
            tp += ((pred == 1) & (yb == 1)).sum().item()
            tn += ((pred == 0) & (yb == 0)).sum().item()
            fp += ((pred == 1) & (yb == 0)).sum().item()
            fn += ((pred == 0) & (yb == 1)).sum().item()
    acc = 100 * correct / total
    print(f"\n=== {tag} ===")
    print(f"  test accuracy: {acc:.1f}%   (chance=50%)")
    print(
        f"  plants correct (recall): {100 * tp / max(tp + fn, 1):.0f}%   "
        f"negatives correct: {100 * tn / max(tn + fp, 1):.0f}%"
    )
    print(f"  false alarms (neg->plant): {fp}   missed plants: {fn}")
    print("  NOTE: single random 80/20 split - see this module's docstring for")
    print("  why this is not the methodology that produced the shipped weights.")

    WEIGHTS_DIR.mkdir(parents=True, exist_ok=True)
    torch.save(model.state_dict(), WEIGHTS_DIR / f"detector3_3ch_{tag}.pt")
    return acc


def main() -> None:
    print("Device:", DEVICE)
    torch.manual_seed(0)
    np.random.seed(0)
    random.seed(0)

    Xp, yp = load_folder("data/threech/positive", 1)  # plants
    Xh, yh = load_folder("data/threech/hard_negative", 0)  # cities/industry/highway
    Xr, yr = load_folder("data/threech/negative", 0)  # rural

    if not Xp or not Xh:
        raise SystemExit(
            "No training tiles found under data/threech/{positive,hard_negative}/ - "
            "run training.export_tiles_3channel first (see training/README.md)."
        )

    idx = list(range(len(Xh)))
    random.shuffle(idx)
    idx = idx[: len(Xp)]
    Xh_bal = [Xh[i] for i in idx]
    yh_bal = [0] * len(Xh_bal)
    acc_hard = run(Xp + Xh_bal, yp + yh_bal, "3ch_hard_only")

    acc_mix = run(Xp + Xh + Xr, yp + yh + yr, "3ch_mixed") if Xr else acc_hard

    print("\n================ RESULT ================")
    print(f"  hard_only accuracy: {acc_hard:.1f}%")
    print(f"  mixed accuracy:     {acc_mix:.1f}%")
    print(f"\nSaved to {WEIGHTS_DIR}/detector3_3ch_hard_only.pt (and _mixed.pt).")
    print(
        "Copy whichever split you trust more to "
        f"{WEIGHTS_DIR}/detector3.pt (see ../weights/README.md) to actually serve it -"
        " but read this module's docstring first about how this differs from the"
        " shipped weights' actual training methodology."
    )


if __name__ == "__main__":
    main()
