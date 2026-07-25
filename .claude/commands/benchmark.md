---
name: benchmark
description: Measure, compare, analyze, and document application performance across the frontend, backend, database, APIs, AI pipelines, and infrastructure using repeatable benchmarks to establish baselines, detect regressions, validate optimizations, and track long-term performance trends.
agents:
  - performance-engineer
  - software-architect
  - backend-engineer
  - frontend-engineer
  - database-engineer
  - api-engineer
  - data-engineer
  - ml-engineer
  - climate-ai-engineer
  - satellite-imagery-engineer
  - devops-engineer
  - qa-engineer
  - documentation-engineer
  - project-manager
---

# Benchmark Command

## Purpose

Establish repeatable performance measurements for the entire system.

Benchmark before and after major changes to detect regressions, validate optimizations, and guide future engineering decisions.

Benchmarking measures performance.

It does not optimize performance.

---

# Objectives

Answer the following questions:

- What is the current performance baseline?
- Has performance improved?
- Has performance regressed?
- Which subsystem is the bottleneck?
- Which metrics require monitoring?
- Are performance budgets satisfied?

---

# General Rules

Always:

- Benchmark before optimization.
- Use repeatable test conditions.
- Compare against historical baselines.
- Record every measurement.
- Explain significant changes.

Never:

- Compare inconsistent environments.
- Benchmark with unknown workloads.
- Ignore measurement variability.
- Draw conclusions from a single run.

---

# Inputs

Review:

- benchmark history
- optimization reports
- monitoring metrics
- performance reports
- production telemetry
- test environment
- deployment configuration

---

# Phase 1 – Benchmark Planning

Performance Engineer should define:

- benchmark scope
- target environment
- workload
- concurrency
- dataset
- metrics
- acceptance thresholds

Document methodology before execution.

---

# Phase 2 – Environment Validation

DevOps Engineer should verify:

- identical environment
- hardware consistency
- container configuration
- cloud resources
- network stability
- software versions

Ensure benchmark conditions are reproducible.

---

# Phase 3 – Backend Benchmark

Backend Engineer should measure:

- request latency
- throughput
- CPU utilization
- memory usage
- background jobs
- serialization
- caching

Record average, median, p95, and p99 where applicable.

---

# Phase 4 – Frontend Benchmark

Frontend Engineer should measure:

- page load time
- Largest Contentful Paint (LCP)
- First Contentful Paint (FCP)
- Interaction to Next Paint (INP)
- bundle size
- hydration
- rendering speed

Evaluate user-perceived performance.

---

# Phase 5 – Database Benchmark

Database Engineer should measure:

- query latency
- transaction throughput
- index performance
- connection pooling
- cache hit ratio
- migration performance

Identify slow queries.

---

# Phase 6 – API Benchmark

API Engineer should measure:

- endpoint latency
- request throughput
- payload size
- authentication overhead
- rate limiting impact

Benchmark critical endpoints separately.

---

# Phase 7 – AI Benchmark

If applicable:

Data Engineer should benchmark:

- ingestion speed
- preprocessing time
- ETL throughput

ML Engineer should benchmark:

- model loading
- inference latency
- batch inference
- memory consumption
- GPU/CPU utilization

Climate AI Engineer should benchmark:

- emissions computation
- climate workflow execution

Satellite Imagery Engineer should benchmark:

- raster loading
- tile generation
- imagery processing
- feature extraction

Skip if AI components are unaffected.

---

# Phase 8 – Infrastructure Benchmark

DevOps Engineer should benchmark:

- deployment time
- container startup
- scaling behavior
- storage throughput
- network latency

Measure infrastructure efficiency.

---

# Phase 9 – Load Testing

QA Engineer should evaluate:

- normal load
- peak load
- sustained load
- stress conditions
- recovery behavior

Document system limits.

---

# Phase 10 – Regression Analysis

Compare:

- current benchmark
- previous benchmark
- production metrics
- optimization goals

Highlight regressions immediately.

---

# Phase 11 – Performance Budgets

Validate against defined budgets such as:

- API latency
- page load time
- memory usage
- CPU utilization
- bundle size
- inference latency

Document any violations.

---

# Phase 12 – Documentation

Documentation Engineer should update:

BENCHMARK_RESULTS.md

PERFORMANCE_HISTORY.md

PERFORMANCE_BASELINE.md

PROJECT_PROGRESS.md

CONTEXT.md

Preserve historical benchmark data.

---

# Benchmark Metrics

Measure where applicable:

Latency

Throughput

CPU

Memory

Disk I/O

Network I/O

Startup Time

Build Time

Bundle Size

Database Queries

Cache Hit Ratio

Inference Latency

Scalability

Availability

---

# Deliverables

Generate or update:

BENCHMARK_RESULTS.md

PERFORMANCE_BASELINE.md

PERFORMANCE_HISTORY.md

LOAD_TEST_RESULTS.md

REGRESSION_REPORT.md

PROJECT_PROGRESS.md

CONTEXT.md

Merge intelligently with existing documentation.

---

# Final Report Format

Produce:

## Executive Summary

## Benchmark Methodology

## Test Environment

## Backend Results

## Frontend Results

## Database Results

## API Results

## AI Results

## Infrastructure Results

## Load Testing

## Performance Budget Validation

## Regression Analysis

## Historical Comparison

## Recommendations

## Next Steps

---

# Quality Checklist

Before finishing verify:

✓ methodology documented

✓ environment validated

✓ backend benchmarked

✓ frontend benchmarked

✓ database benchmarked

✓ APIs benchmarked

✓ AI benchmarked if applicable

✓ infrastructure benchmarked

✓ load testing completed

✓ performance budgets checked

✓ regression analysis completed

✓ documentation updated

✓ project progress updated

✓ context updated

---

# Success Criteria

This command succeeds only if:

- Reliable baseline measurements are recorded.
- Performance is compared against historical data.
- Regressions are identified.
- Performance budgets are evaluated.
- Results are reproducible.
- Documentation is synchronized.

---

# End Goal

Create a reliable benchmarking system that objectively measures application performance over time, validates engineering improvements, detects regressions early, and provides a trusted foundation for optimization and capacity planning.