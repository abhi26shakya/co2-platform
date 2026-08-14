# Credentials setup: Google Earth Engine + NASA Earthdata

Required for the real ML/satellite integration (see `docs/ml-integration.md`
and the "Real ML Model + Satellite Data Integration" plan). Both the
`backend` (Track A: OCO-3 physics pipeline, runs as a batch job) and
`ml-service` (Track B: NO2/SO2 CNN, fetches tiles at request time) need
these credentials. Neither service will crash without them - `gee_configured`
/ `nasa_earthdata_configured` gate every code path that needs them and
return a clean 503 (`CredentialsNotConfiguredError`) instead. You can run
everything else in this platform with these unset.

## 1. Google Earth Engine service account

Your research repo (`co2-emission-estimation/process_plant.py`) used
`ee.Initialize(project="co2detectionusingsatellitedata")` - that's personal
OAuth, tied to your logged-in Google account, and works fine on a laptop
but not in a headless server container. You need a **service account**
instead, which can reuse the same GCP project if you already have one.

Steps:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
   If `co2detectionusingsatellitedata` (or whatever project the research
   repo used) already exists and you have access, use it. Otherwise create
   a new project.
2. Enable the **Earth Engine API** for that project: APIs & Services >
   Library > search "Earth Engine API" > Enable.
3. Register the project for Earth Engine access at
   [signup.earthengine.google.com](https://signup.earthengine.google.com/)
   if it isn't already registered (personal accounts and service accounts
   both need the underlying GCP project registered for EE).
4. Create a service account: IAM & Admin > Service Accounts > Create
   Service Account. Grant it the **Earth Engine Resource Writer** role (or
   `Editor` if that role isn't available in your console version).
5. Create a JSON key for that service account: on the service account's
   page, Keys > Add Key > Create new key > JSON. This downloads a file -
   **do not commit it**.
6. Copy it to `secrets/gee-service-account.json` (gitignored; the repo only
   tracks `secrets/gee-service-account.json.example` as a placeholder).
7. Set in `backend/.env` and `ml-service/.env` (or the equivalent
   Compose/deployment env):
   ```
   # backend/.env
   CO2_GEE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
   CO2_GEE_SERVICE_ACCOUNT_KEY_PATH=/run/secrets/gee-service-account.json
   CO2_GEE_PROJECT_ID=your-gcp-project-id

   # ml-service/.env
   CO2ML_GEE_SERVICE_ACCOUNT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
   CO2ML_GEE_SERVICE_ACCOUNT_KEY_PATH=/run/secrets/gee-service-account.json
   CO2ML_GEE_PROJECT_ID=your-gcp-project-id
   ```
   `docker-compose.yml` bind-mounts the whole `./secrets` directory to
   `/run/secrets` (read-only) in both `backend` and `ml-service` - a
   directory mount so it works whether or not the real key file exists yet
   (an empty `secrets/` dir is fine; `gee_configured` just stays `false`).

   Note: under `docker compose up`, the `backend`/`ml-service` service
   blocks in `docker-compose.yml` read these values via Compose variable
   interpolation, not directly from `backend/.env`/`ml-service/.env`. Export
   the same `CO2_*`/`CO2ML_*` names in your shell, or put them in a `.env`
   file at the repo root (Compose auto-loads that one), before running
   `docker compose up`.

## 2. NASA Earthdata login (for OCO-3 granule downloads via `earthaccess`)

1. Register a free account at
   [urs.earthdata.nasa.gov](https://urs.earthdata.nasa.gov/users/new) if
   you don't already have one.
2. Set in both services' env:
   ```
   CO2_NASA_EARTHDATA_USERNAME=your-username        # backend/.env
   CO2_NASA_EARTHDATA_PASSWORD=your-password
   CO2ML_NASA_EARTHDATA_USERNAME=your-username       # ml-service/.env
   CO2ML_NASA_EARTHDATA_PASSWORD=your-password
   ```
   Code reads these via `earthaccess.login(strategy="environment")`, which
   picks up `EARTHDATA_USERNAME`/`EARTHDATA_PASSWORD` - the
   `oco3_analysis.py`/`gee_client.py` startup code sets those from the
   `CO2_`/`CO2ML_`-prefixed settings before calling `earthaccess.login()`.
   This avoids the source repo's `earthaccess.login(persist=True)`, which
   writes an interactive `~/.netrc`-style cache unsuitable for a container.

## 3. Verify

```bash
curl http://localhost:8000/api/v1/system/status   # (once backend exposes gee/nasa flags, if added)
curl http://localhost:8001/health/credentials
# {"gee": true, "nasa_earthdata": true}
```

Both should report `true` once configured. `false` is not an error state -
it just means the OCO-3 batch job and CNN inference will skip/decline
gracefully rather than run.
