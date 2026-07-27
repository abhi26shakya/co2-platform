# Training Track B (the NO2/SO2 CNN detector)

Not part of the served app - `app/main.py` never imports anything under
`training/`. Run these manually, offline, with a GPU and Earth Engine
credentials, to produce `../weights/detector2.pt`.

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
