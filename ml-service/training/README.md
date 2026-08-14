# Training Track B (the NO2/SO2/VIIRS CNN detector)

Not part of the served app - `app/main.py` never imports anything under
`training/`. Run these manually, offline, with a GPU and Earth Engine
credentials, to produce `../weights/detector3.pt`.

**Recommended: don't run this at all.** The research repo already has a
trained, exhaustive-LOFO-evaluated checkpoint (`detector3_2ch_mixed_facility_split.pt`,
69.1% recall) that matches `Detector3` exactly - copy it directly (see
`../weights/README.md`'s "How to get it"). The steps below (`export_tiles_3channel.py`
+ `train_3channel.py`) are for from-scratch reproducibility only, and use
a simpler random-split methodology that will NOT reproduce that 69.1%
figure - see `train_3channel.py`'s own docstring.

This directory also still has the earlier 2-channel (NO2+SO2 only)
scripts (`export_tiles.py`, `train_2channel.py`) - kept, not removed,
but superseded by the 3-channel versions below as what `Detector3`
(the served architecture) actually needs.

Ported and adapted from the source research repo
(`devashishpandey044-code/co2-emission-estimation`) with credential
handling switched to this project's `CO2ML_GEE_*` config instead of a
hardcoded GCP project string. Faithful in spirit to the original weekly
experiments (see that repo's `WEEK2_LOG.txt`/`WEEK3_LOG.txt` for the
rationale behind the 2-channel NO2+SO2 approach), reorganized to fit this
service's layout rather than copied byte-for-byte.

## Setup

```bash
cd ml-service
python -m venv .venv-training && source .venv-training/bin/activate
pip install -r requirements.txt -r requirements-model.txt
export CO2ML_GEE_SERVICE_ACCOUNT_EMAIL=...
export CO2ML_GEE_SERVICE_ACCOUNT_KEY_PATH=...
export CO2ML_GEE_PROJECT_ID=...
```

## 1. Export tiles

```bash
python -m training.export_tiles --plants data/powerplants.csv --out data/twoch/positive
python -m training.export_tiles --locations data/hard_negatives.csv --out data/twoch/hard_negative
```

`data/powerplants.csv` / `data/hard_negatives.csv` need `name,latitude,longitude`
columns - see the source repo's committed CSVs for the exact locations
used in the original experiment (Indian coal plants for positives; steel
plants, major cities, and highways for hard negatives - the Week 3 finding
was that the single-channel NO2 model confuses these with power plants).

## 2. Train

```bash
python -m training.train_2channel
```

Trains `Detector2` (see `app/inference/model.py`'s `_TorchCnnScorer` - the
architecture there MUST match this file's `Detector2` exactly) on
balanced positive/hard-negative tiles, reporting accuracy against both a
hard-negatives-only split and a mixed split (matching the source repo's
Week 3/4 evaluation methodology). Saves `../weights/detector2.pt`.

## 3. Verify

Drop the resulting `weights/detector2.pt` in place (see
`../weights/README.md`), set `CO2ML_PREDICTOR=combined`, and run
`ml-service/scripts/smoke_test_live.py` (needs real credentials) or the
manual verification steps in `docs/credentials-setup.md`.

## 3-channel (NO2+SO2+VIIRS) equivalent

Same shape, one more band. Only needed if reproducing `detector3.pt` from
scratch instead of copying it from the research repo (recommended path,
see top of this file):

```bash
python -m training.export_tiles_3channel --plants data/powerplants.csv --out data/threech/positive
python -m training.export_tiles_3channel --locations data/hard_negatives.csv --out data/threech/hard_negative
python -m training.train_3channel
```

Trains `Detector3` (matching `app/inference/model.py`'s
`_TorchCnnScorer.Detector3` exactly), saves
`weights/detector3_3ch_hard_only.pt` / `_mixed.pt`. Copy whichever split
you trust more to `weights/detector3.pt`, set `CO2ML_PREDICTOR=combined`,
and verify the same way as step 3 above.
