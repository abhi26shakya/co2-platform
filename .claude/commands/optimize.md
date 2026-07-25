---
name: optimize
description: Analyze, benchmark, optimize, validate, and document application performance across the frontend, backend, database, APIs, AI pipelines, infrastructure, and cloud resources while preserving correctness and architectural integrity.
agents:
  - performance-engineer
  - software-architect
  - project-manager
  - backend-engineer
  - frontend-engineer
  - database-engineer
  - api-engineer
  - data-engineer
  - ml-engineer
  - climate-ai-engineer
  - satellite-imagery-engineer
  - security-engineer
  - qa-engineer
  - documentation-engineer
  - code-reviewer
---

# Optimize Command

## Purpose

Improve measurable system performance without sacrificing correctness, maintainability, security, or architectural quality.

Optimization should be based on evidence, not assumptions.

---

# Objectives

Answer the following questions:

- Where are the performance bottlenecks?
- What metrics support optimization?
- Which optimizations provide the highest impact?
- Are improvements measurable?
- Were regressions introduced?
- Does scalability improve?

---

# General Rules

Always:

- Measure before optimizing.
- Optimize the bottleneck first.
- Benchmark before and after.
- Preserve correctness.
- Maintain readability.
- Document every optimization.

Never:

- Optimize based on intuition alone.
- Introduce unnecessary complexity.
- Sacrifice maintainability for marginal gains.
- Skip validation.

---

# Inputs

Review:

- performance reports
- benchmark results
- profiling data
- monitoring dashboards
- architecture documentation
- production metrics
- previous optimizations
- test reports

---

# Phase 1 – Performance Profiling

Performance Engineer should identify:

- CPU bottlenecks
- memory bottlenecks
- disk bottlenecks
- network bottlenecks
- rendering bottlenecks
- database bottlenecks
- API bottlenecks
- AI inference bottlenecks

Collect measurable evidence before proposing changes.

---

# Phase 2 – Bottleneck Analysis

Rank issues by:

- user impact
- frequency
- execution cost
- scalability impact
- implementation effort

Focus on high-impact improvements first.

---

# Phase 3 – Architecture Review

Software Architect should verify:

- architectural scalability
- unnecessary coupling
- inefficient workflows
- synchronous operations
- opportunities for parallelism

Recommend structural improvements only when justified.

---

# Phase 4 – Backend Optimization

Backend Engineer should evaluate:

- algorithms
- service logic
- asynchronous processing
- caching
- background jobs
- serialization
- memory allocation

Prefer algorithmic improvements over micro-optimizations.

---

# Phase 5 – Frontend Optimization

Frontend Engineer should optimize:

- bundle size
- lazy loading
- code splitting
- rendering
- memoization
- hydration
- asset loading
- image optimization

Improve perceived and actual performance.

---

# Phase 6 – Database Optimization

Database Engineer should evaluate:

- indexes
- query plans
- joins
- transactions
- normalization
- denormalization
- caching
- connection pooling

Measure query improvements before and after.

---

# Phase 7 – API Optimization

API Engineer should optimize:

- endpoint latency
- payload size
- pagination
- batching
- compression
- caching
- retries
- timeouts

Maintain backward compatibility.

---

# Phase 8 – Data & AI Optimization

Data Engineer should optimize:

- ingestion pipelines
- ETL performance
- preprocessing
- storage efficiency

ML Engineer should optimize:

- inference latency
- model loading
- batching
- hardware utilization
- memory usage

Climate AI Engineer should verify:

- optimization preserves scientific validity

Satellite Imagery Engineer should optimize:

- raster processing
- tile loading
- geospatial indexing
- imagery pipelines

Skip these phases if not applicable.

---

# Phase 9 – Security Validation

Security Engineer should verify:

- optimization introduces no vulnerabilities
- caching respects authorization
- secrets remain protected
- rate limiting preserved

---

# Phase 10 – Benchmarking

Measure:

- response time
- throughput
- memory usage
- CPU usage
- startup time
- build time
- database latency
- AI inference latency

Compare against the baseline.

---

# Phase 11 – Regression Testing

QA Engineer should execute:

- unit tests
- integration tests
- regression tests
- load tests where applicable

Ensure correctness is preserved.

---

# Phase 12 – Documentation

Documentation Engineer should update:

OPTIMIZATION_REPORT.md

BENCHMARK_RESULTS.md

PERFORMANCE_GUIDE.md

PROJECT_PROGRESS.md

CONTEXT.md

Document every measurable improvement.

---

# Code Review

Code Reviewer should verify:

- maintainability preserved
- optimization justified
- readability acceptable
- architectural compliance maintained

Reject unnecessary complexity.

---

# Optimization Principles

Prefer:

- algorithmic improvements
- efficient data structures
- caching
- batching
- lazy evaluation
- parallel execution
- asynchronous processing
- efficient I/O

Avoid:

- premature optimization
- hidden complexity
- duplicated optimization logic
- unnecessary abstractions

---

# Deliverables

Generate or update:

OPTIMIZATION_PLAN.md

OPTIMIZATION_REPORT.md

BENCHMARK_RESULTS.md

PERFORMANCE_GUIDE.md

PROJECT_PROGRESS.md

CONTEXT.md

Merge intelligently.

---

# Final Report Format

Produce:

## Executive Summary

## Baseline Metrics

## Bottleneck Analysis

## Optimization Plan

## Backend Improvements

## Frontend Improvements

## Database Improvements

## API Improvements

## AI/Data Improvements

## Security Validation

## Benchmark Comparison

## Regression Testing

## Documentation Updates

## Remaining Opportunities

## Recommended Next Steps

---

# Quality Checklist

Before finishing verify:

✓ bottlenecks measured

✓ optimizations evidence-based

✓ architecture respected

✓ backend optimized

✓ frontend optimized

✓ database optimized

✓ APIs optimized

✓ AI optimized if applicable

✓ benchmarks recorded

✓ regressions absent

✓ security preserved

✓ documentation updated

✓ project progress updated

✓ context updated

---

# Success Criteria

This command succeeds only if:

- Performance improvements are measurable.
- Benchmarks demonstrate improvement.
- Functionality remains unchanged.
- Scalability improves where appropriate.
- Documentation reflects all optimizations.
- No regressions are introduced.

---

# End Goal

Continuously improve the speed, efficiency, scalability, and resource utilization of the system through evidence-based optimization while maintaining correctness, security, maintainability, and architectural integrity.