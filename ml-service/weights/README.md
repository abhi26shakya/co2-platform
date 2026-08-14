# Model weights

This directory holds trained weights for Track B (the NO2/SO2/VIIRS CNN
detector). Gitignored (`*.pt`) - weights are a data artifact, not code.

## Expected file

`app/inference/model.py`'s `CombinedPredictor` looks for:

```
weights/detector3.pt
```

If it's not there, `CombinedPredictor` still constructs and serves
requests fine - Track B is simply disabled (`detection_confidence` stays
0, `data_source` falls back to `"oco3_estimated"` if a nearby plant has
OCO-3 data, or `"unavailable"` otherwise). Missing weights are never a
startup error.

(Upgraded from a 2-channel `detector2.pt` placeholder architecture, which
was never actually trained in this repo, to the research repo's real,
already-trained 3-channel detector - see Provenance below.)

## How to get it (recommended path)

The research repo (`abhi26shakya/co2-emission-estimation`) already has a
trained, evaluated checkpoint - `detector3_2ch_mixed_facility_split.pt` -
that this repo's `Detector3` architecture matches exactly. Copy it
directly, no training needed:

```bash
cp /path/to/co2-emission-estimation/detector3_2ch_mixed_facility_split.pt \
   ml-service/weights/detector3.pt
```

(Its filename says "2ch" for historical reasons in that repo - it is the
3-channel NO2+SO2+VIIRS `Detector3` architecture; confirmed against its
own `train_3channel.py`/`gradcam_3channel.py`.)

## How to reproduce from scratch (alternative)

See `../training/README.md` for the full training pipeline. In short:

```bash
cd ml-service
python -m training.export_tiles_3channel --locations data/powerplants.csv --out data/threech/positive
python -m training.export_tiles_3channel --locations data/hard_negatives.csv --out data/threech/hard_negative
python -m training.train_3channel
```

This produces `weights/detector3_3ch_hard_only.pt` and
`weights/detector3_3ch_mixed.pt` (two evaluation splits). Copy whichever
split you trust more to `weights/detector3.pt`. **Read
`train_3channel.py`'s docstring first** - this simple random-split
training run will NOT reproduce the 69.1% exhaustive-LOFO recall figure
below; it only exists for from-scratch reproducibility using this repo's
own simpler training convention.

## Deploying it

Local dev: the file just needs to exist at `ml-service/weights/detector3.pt`
before the container starts (or bind-mount the directory, matching the
`secrets/` pattern in `docker-compose.yml`).

Docker: `ml-service/Dockerfile`'s `COPY . .` picks up anything present in
`weights/` at build time. For a weights update without a full rebuild,
bind-mount `./ml-service/weights:/app/weights` instead.

## Provenance

**`weights/detector3.pt`**, copied from the research repo's
`detector3_2ch_mixed_facility_split.pt`:

- **Dataset**: 21 Indian coal power plant facilities (up from an original
  4), each with 24 months of NO2+SO2+VIIRS tile depth (2019+2020),
  fused with hard-negative (cities, steel plants, highways) and rural
  negative classes.
- **Split**: facility-level (not tile-level - all of one physical site's
  tiles are kept together on one side of the split, to avoid the same
  facility appearing in both train and test under a different month).
- **Evaluation**: exhaustive leave-one-facility-out (LOFO) - 22 folds,
  every facility held out once and the model retrained from scratch each
  time, recall measured on that facility's own tiles.
- **Result: 69.1% mean LOFO recall** (up from an original 47.2% before a
  second training-data year closed a real data-quantity gap - see that
  repo's `RESEARCH_PAPER.md` Sec 5.1.1 for the full ablation). This is
  the honest, hardest-to-game number that repo reports for this
  checkpoint - not the easier single-random-split figure (88%) an
  earlier pass in that repo's history found and then superseded once
  the exhaustive LOFO evaluation showed it was an artifact of an easy
  split draw.
- **Known limitation, carried over honestly**: two facilities (Kudgi,
  ShriSingajiMalwa) still show 0% LOFO recall even after the data-
  quantity fix - diagnosed in that repo as a genuine satellite-
  observability limit (their raw NO2/SO2 signal sits at or below the
  rural-negative noise floor in every month checked), not a fixable
  modeling gap. `CombinedPredictor` will still return a low-confidence
  `detection_confidence` for tiles near these two, which is the correct,
  expected behavior, not a bug.
