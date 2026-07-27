# Model weights

This directory holds trained weights for Track B (the NO2/SO2 CNN
detector). Gitignored (`*.pt`) - weights are a data artifact, not code,
and nothing in this repo has trained any yet.

## Expected file

`app/inference/model.py`'s `CombinedPredictor` looks for:

```
weights/detector2.pt
```

If it's not there, `CombinedPredictor` still constructs and serves
requests fine - Track B is simply disabled (`detection_confidence` stays
0, `data_source` falls back to `"oco3_estimated"` if a nearby plant has
OCO-3 data, or `"unavailable"` otherwise). Missing weights are never a
startup error.

## How to produce it

See `../training/README.md` for the full training pipeline. In short:

```bash
cd ml-service
python -m training.export_tiles --locations data/powerplants.csv --out data/twoch/positive
python -m training.export_tiles --locations data/hard_negatives.csv --out data/twoch/hard_negative
python -m training.train_2channel
```

This produces `weights/detector2_2ch_hard_only.pt` and
`weights/detector2_2ch_mixed.pt` (two evaluation splits, see
`train_2channel.py`'s docstring for what each means). Copy whichever
split you trust more to `weights/detector2.pt`:

```bash
cp weights/detector2_2ch_hard_only.pt weights/detector2.pt
```

## Deploying it

Local dev: the file just needs to exist at `ml-service/weights/detector2.pt`
before the container starts (or bind-mount the directory, matching the
`secrets/` pattern in `docker-compose.yml`).

Docker: `ml-service/Dockerfile`'s `COPY . .` picks up anything present in
`weights/` at build time. For a weights update without a full rebuild,
bind-mount `./ml-service/weights:/app/weights` instead.

## Provenance

Record here once a real weights file is produced: training date, dataset
size/composition (plant count, hard-negative count), the two accuracy
numbers from `train_2channel.py`'s output, and which split was chosen.
Nothing recorded yet - no model has been trained in this deployment.
