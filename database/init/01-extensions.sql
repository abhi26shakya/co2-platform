-- Runs once on first postgres container start.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- PostGIS can be enabled later if spatial queries are needed:
-- CREATE EXTENSION IF NOT EXISTS postgis;
