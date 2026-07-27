"""Trains the 2-channel (NO2+SO2) power-plant detector.

Ported near-verbatim from the source research repo's train_2channel.py
(Week 4 of that project's log) - same architecture, same balanced-vs-mixed
evaluation methodology. Only the output path changed, from a bare
`detector2_{tag}.pt` in the working directory to `../weights/detector2.pt`,
matching this repo's weight-drop convention (see ../weights/README.md).

The Week 3 finding this exists to address: a single-channel (NO2-only)
model is really a "concentrated combustion detector," not power-plant-
specific - it confuses steel plants and dense urban NO2 hotspots with
power plants. Adding SO2 as a second channel was the Week 4 attempt to
reduce that confusion. Whether it actually helps enough to trust in
production is an open question this training run answers, not something
assumed by this script.

Usage (from ml-service/, training venv active - see training/README.md):
    python -m training.train_2channel
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


class Detector2(nn.Module):
    """Must match app/inference/model.py's _TorchCnnScorer.Detector2 exactly."""

    def __init__(self) -> None:
        super().__init__()
        self.net = nn.Sequential(
            nn.Conv2d(2, 16, 3, padding=1),
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
        arr = np.load(f).astype(np.float32)  # shape (2, 64, 64)
        X.append(arr)
        y.append(label)
    return X, y


def run(X_list: list, y_list: list, tag: str, epochs: int = 30) -> float:
    X = np.stack(X_list)  # (N, 2, 64, 64)
    y = np.array(y_list, dtype=np.int64)
    for c in range(2):
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

    model = Detector2().to(DEVICE)
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

    WEIGHTS_DIR.mkdir(parents=True, exist_ok=True)
    torch.save(model.state_dict(), WEIGHTS_DIR / f"detector2_{tag}.pt")
    return acc


def main() -> None:
    print("Device:", DEVICE)
    torch.manual_seed(0)
    np.random.seed(0)
    random.seed(0)

    Xp, yp = load_folder("data/twoch/positive", 1)  # plants
    Xh, yh = load_folder("data/twoch/hard_negative", 0)  # cities/industry/highway
    Xr, yr = load_folder("data/twoch/negative", 0)  # rural

    if not Xp or not Xh:
        raise SystemExit(
            "No training tiles found under data/twoch/{positive,hard_negative}/ - "
            "run training.export_tiles first (see training/README.md)."
        )

    idx = list(range(len(Xh)))
    random.shuffle(idx)
    idx = idx[: len(Xp)]
    Xh_bal = [Xh[i] for i in idx]
    yh_bal = [0] * len(Xh_bal)
    acc_hard = run(Xp + Xh_bal, yp + yh_bal, "2ch_hard_only")

    acc_mix = run(Xp + Xh + Xr, yp + yh + yr, "2ch_mixed") if Xr else acc_hard

    print("\n================ RESULT ================")
    print(f"  hard_only accuracy: {acc_hard:.1f}%")
    print(f"  mixed accuracy:     {acc_mix:.1f}%")
    print(f"\nSaved to {WEIGHTS_DIR}/detector2_2ch_hard_only.pt (and _mixed.pt).")
    print(
        "Copy whichever split you trust more to "
        f"{WEIGHTS_DIR}/detector2.pt (see ../weights/README.md) to actually serve it."
    )


if __name__ == "__main__":
    main()
