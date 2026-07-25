---
name: optimization
description: Comprehensive workflow for identifying, analyzing, implementing, validating, and documenting performance optimizations across application architecture, backend, frontend, databases, APIs, AI systems, and infrastructure while preserving correctness and maintainability.
version: 1.0
owner: performance-engineer
---

# Optimization Workflow

## Purpose

Improve system performance through a structured, evidence-based optimization process.

Optimization should be driven by measurable bottlenecks rather than assumptions, while preserving correctness, maintainability, scalability, and security.

---

# When To Use

Use this workflow when:

- Performance targets are not met
- Benchmark regressions are detected
- Scaling issues appear
- Infrastructure costs increase
- Large features impact responsiveness
- Preparing for production scale
- Database performance degrades
- AI inference becomes slow

Do not use for:

- Feature development
- Bug fixing
- Security audits
- Documentation-only updates

---

# Objectives

Improve:

- Response Time
- Throughput
- Scalability
- Resource Utilization
- User Experience
- Infrastructure Efficiency
- Cost Efficiency
- AI Inference Performance

Every optimization must be measurable.

---

# Workflow Overview

```
Performance Issue
        │
        ▼
Problem Definition
        │
        ▼
Profiling
        │
        ▼
Root Cause Analysis
        │
        ▼
Optimization Planning
        │
        ▼
Implementation
        │
        ▼
Benchmark Validation
        │
        ▼
Regression Testing
        │
        ▼
Documentation
        │
        ▼
Performance Approved
```

---

# Participating Agents

Leadership

- Project Manager

Architecture

- Software Architect

Engineering

- Backend Engineer
- Frontend Engineer
- Database Engineer
- API Engineer

AI

- Data Engineer
- ML Engineer
- Climate AI Engineer
- Satellite Imagery Engineer

Infrastructure

- DevOps Engineer

Quality

- Performance Engineer
- QA Engineer
- Security Engineer

Documentation

- Documentation Engineer

Governance

- Code Reviewer

---

# Phase 1 — Performance Assessment

Performance Engineer should identify:

- reported bottlenecks
- user impact
- affected systems
- performance budgets
- historical benchmarks

Define measurable optimization goals.

---

# Phase 2 — Profiling

Profile:

Backend

Frontend

Database

API

Infrastructure

AI Models

Measure:

- CPU
- Memory
- Disk I/O
- Network
- Queries
- Rendering
- Latency
- Throughput

Never optimize without profiling evidence.

---

# Phase 3 — Root Cause Analysis

Determine:

- true bottleneck
- affected subsystem
- architectural causes
- unnecessary work
- resource contention
- inefficient algorithms

Document the actual cause rather than symptoms.

---

# Phase 4 — Optimization Planning

Software Architect should determine:

- optimization strategy
- expected gains
- architectural impact
- implementation order
- rollback strategy

Prioritize low-risk, high-impact improvements.

---

# Phase 5 — Backend Optimization

Backend Engineer should evaluate:

- algorithms
- database access
- caching
- asynchronous processing
- serialization
- background jobs

Focus on measurable improvements.

---

# Phase 6 — Frontend Optimization

Frontend Engineer should optimize:

- rendering
- bundle size
- lazy loading
- code splitting
- image optimization
- hydration
- state updates

Improve perceived user performance.

---

# Phase 7 — Database Optimization

Database Engineer should optimize:

- slow queries
- indexes
- schema
- transactions
- connection pooling
- caching

Avoid premature denormalization.

---

# Phase 8 — API Optimization

API Engineer should optimize:

- payload size
- serialization
- pagination
- caching
- compression
- batching

Maintain backward compatibility.

---

# Phase 9 — AI Optimization

If applicable

Data Engineer

Optimize:

- preprocessing
- ETL
- feature engineering

ML Engineer

Optimize:

- inference
- batching
- quantization
- model loading
- hardware utilization

Climate AI Engineer

Optimize:

- emissions calculations
- scientific workflows

Satellite Imagery Engineer

Optimize:

- raster processing
- tile generation
- imagery loading

Skip if not applicable.

---

# Phase 10 — Infrastructure Optimization

DevOps Engineer should optimize:

- containers
- autoscaling
- networking
- storage
- CDN
- monitoring
- deployment efficiency

Reduce operational cost where practical.

---

# Phase 11 — Benchmark Validation

Performance Engineer should compare:

Before

After

Metrics should include:

- latency
- throughput
- CPU
- memory
- startup time
- build time
- infrastructure utilization

Every optimization must demonstrate measurable improvement.

---

# Phase 12 — Regression Testing

QA Engineer should verify:

- functionality preserved
- integration intact
- no performance regressions
- compatibility maintained

Security Engineer should verify:

- optimization introduced no security risks

---

# Phase 13 — Documentation

Documentation Engineer should update:

OPTIMIZATION_REPORT.md

BENCHMARK_RESULTS.md

PERFORMANCE_HISTORY.md

CHANGELOG.md

PROJECT_PROGRESS.md

CONTEXT.md

Document all measurable improvements.

---

# Optimization Checklist

Verify:

✓ bottleneck identified

✓ profiling completed

✓ root cause documented

✓ optimization implemented

✓ benchmark improved

✓ regressions absent

✓ security maintained

✓ documentation updated

✓ performance budgets satisfied

---

# Deliverables

Generate or update:

OPTIMIZATION_PLAN.md

OPTIMIZATION_REPORT.md

BENCHMARK_RESULTS.md

PERFORMANCE_HISTORY.md

PERFORMANCE_BASELINE.md

CHANGELOG.md

PROJECT_PROGRESS.md

CONTEXT.md

Merge intelligently with existing documentation.

---

# Success Criteria

Optimization succeeds only if:

✓ bottleneck confirmed

✓ measurable improvement achieved

✓ benchmarks recorded

✓ functionality preserved

✓ security maintained

✓ regression testing passed

✓ documentation synchronized

✓ performance budgets met

---

# Related Commands

Primary

- /optimize
- /benchmark

Supporting

- /review
- /test
- /audit
- /deploy

---

# Failure Handling

If optimization goals are not achieved:

- document attempted improvements
- identify remaining bottlenecks
- compare benchmark results
- recommend alternative strategies
- avoid merging optimizations that degrade maintainability without significant measurable benefit

Never accept an optimization that sacrifices correctness or introduces regressions without explicit approval.

---

# End Goal

Deliver measurable, evidence-based performance improvements through a disciplined optimization process that identifies real bottlenecks, validates gains with benchmarks, preserves system correctness, maintains security, and documents every optimization for future engineering decisions.