---
name: optimization
description: Analyze, optimize, benchmark, and validate application performance, scalability, and resource utilization using evidence-based engineering practices.
version: 1.0
owner: performance-engineer

agents:
  - performance-engineer
  - software-architect
  - backend-engineer
  - frontend-engineer
  - database-engineer
  - api-engineer
  - devops-engineer
  - qa-engineer
  - documentation-engineer

workflows:
  - optimization
  - architecture-review
  - code-review
  - testing

commands:
  - optimize
  - benchmark
  - review
  - test

standards:
  - performance-guidelines
  - architecture-principles
  - coding-standards
  - testing-standards
  - documentation-standards

outputs:
  - PERFORMANCE_REPORT.md
  - BENCHMARK_RESULTS.md
  - OPTIMIZATION_PLAN.md
  - BOTTLENECK_ANALYSIS.md
  - RESOURCE_USAGE.md
  - PROJECT_PROGRESS.md
  - CONTEXT.md
---

# Performance Optimization Prompt

## Mission

Improve system performance using measurable evidence.

Optimize only after understanding how the system behaves.

Every optimization should improve performance without sacrificing:

- correctness
- maintainability
- readability
- security
- reliability

Measure first.

Optimize second.

Validate third.

---

# Phase 1 — Understand the System

Review:

- Architecture Review
- Feature Documentation
- API Design
- Database Design
- Existing Benchmarks
- Monitoring Data

Determine:

- critical user flows
- expected workload
- latency targets
- throughput requirements
- scalability goals

---

# Phase 2 — Establish Baseline

Measure current performance.

Collect:

- response time
- throughput
- CPU usage
- memory usage
- disk I/O
- network utilization
- startup time
- bundle size
- page load metrics

Generate:

BENCHMARK_RESULTS.md

Optimization begins only after a baseline exists.

---

# Phase 3 — Profile the System

Identify bottlenecks.

Analyze:

Backend

- CPU hotspots
- blocking operations
- synchronous code
- inefficient algorithms

Frontend

- unnecessary renders
- hydration cost
- bundle size
- layout shifts
- animation cost

Database

- slow queries
- joins
- indexes
- locking
- transactions

Infrastructure

- containers
- networking
- storage
- caching

Generate:

BOTTLENECK_ANALYSIS.md

---

# Phase 4 — Backend Optimization

Evaluate:

- algorithms
- data structures
- concurrency
- async execution
- caching
- serialization
- object allocation
- repeated computations

Prefer improving algorithmic complexity before micro-optimizations.

---

# Phase 5 — Frontend Optimization

Review:

- rendering frequency
- component hierarchy
- memoization
- lazy loading
- code splitting
- image optimization
- asset compression
- font loading
- state management

Prioritize perceived performance as well as measured performance.

---

# Phase 6 — Database Optimization

Review:

- query plans
- indexing
- joins
- pagination
- transactions
- connection pooling
- denormalization (when justified)

Avoid premature denormalization.

---

# Phase 7 — API Optimization

Evaluate:

- payload size
- batching
- pagination
- filtering
- compression
- caching
- network round trips

Reduce unnecessary requests.

---

# Phase 8 — Infrastructure Optimization

Review:

- autoscaling
- container sizing
- CDN usage
- load balancing
- caching layers
- storage configuration
- monitoring
- logging overhead

Document infrastructure improvements.

---

# Phase 9 — Scalability Assessment

Estimate system behavior under increasing load.

Consider:

- concurrent users
- request spikes
- database growth
- file storage growth
- queue depth
- background jobs

Recommend scaling strategies.

---

# Phase 10 — Resource Utilization

Measure:

- CPU efficiency
- memory allocation
- garbage collection
- disk usage
- network traffic

Generate:

RESOURCE_USAGE.md

Identify unnecessary resource consumption.

---

# Phase 11 — Regression Validation

Verify optimizations do not introduce:

- functional regressions
- security regressions
- compatibility issues
- race conditions
- memory leaks

Run:

- unit tests
- integration tests
- performance benchmarks
- regression tests

---

# Phase 12 — Benchmark Comparison

Compare:

Before Optimization

↓

After Optimization

Measure improvements for:

- latency
- throughput
- memory
- CPU
- bundle size
- database performance

Document measurable gains.

---

# Phase 13 — Optimization Plan

Summarize:

- identified bottlenecks
- implemented improvements
- remaining limitations
- future optimization opportunities

Generate:

OPTIMIZATION_PLAN.md

---

# Phase 14 — Documentation

Generate:

- PERFORMANCE_REPORT.md
- BENCHMARK_RESULTS.md
- BOTTLENECK_ANALYSIS.md
- RESOURCE_USAGE.md
- OPTIMIZATION_PLAN.md

Update:

PROJECT_PROGRESS.md

Update:

CONTEXT.md

---

# Deliverables

Produce or update:

- PERFORMANCE_REPORT.md
- BENCHMARK_RESULTS.md
- BOTTLENECK_ANALYSIS.md
- RESOURCE_USAGE.md
- OPTIMIZATION_PLAN.md
- PROJECT_PROGRESS.md
- CONTEXT.md

---

# Performance Principles

Always:

- Measure before optimizing.
- Profile before changing code.
- Optimize bottlenecks first.
- Validate improvements with benchmarks.
- Keep optimizations understandable.
- Document performance gains.
- Preserve correctness and maintainability.

Never:

- Optimize without evidence.
- Sacrifice readability for negligible gains.
- Introduce complexity without measurable benefit.
- Remove safety checks solely for speed.
- Ignore regressions after optimization.

---

# Success Metrics

Evaluate improvements using measurable indicators such as:

- API response latency
- Throughput
- Database query time
- Frontend rendering time
- Core Web Vitals (where applicable)
- Memory usage
- CPU utilization
- Startup time
- Bundle size
- Cache hit rate

---

# Definition of Done

Performance optimization is complete only when:

- A baseline has been established.
- Bottlenecks have been identified.
- Improvements are backed by benchmarks.
- No functional regressions exist.
- Resource usage is documented.
- Scalability has been evaluated.
- Documentation is complete.
- Project progress and context have been updated.