---
name: roadmap
description: Generate and maintain a strategic product and engineering roadmap based on repository analysis, business goals, technical priorities, and project vision. Prioritize features, technical debt, infrastructure, AI capabilities, and long-term scalability.
agents:
  - startup-product-manager
  - project-manager
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
  - documentation-engineer
---

# Roadmap Command

## Purpose

Generate a comprehensive roadmap for the project.

Transform repository analysis into an actionable execution plan.

Balance business priorities, technical improvements, research goals, and long-term maintainability.

This command plans work.

It does not implement work.

---

# Objectives

Answer the following questions:

- What should be built next?
- What is blocking progress?
- What technical debt should be resolved?
- Which features provide the highest value?
- Which work is required before scaling?
- What milestones should be achieved?

---

# General Rules

Always:

- Base recommendations on repository evidence.
- Align with the product vision.
- Balance user value with engineering effort.
- Consider technical dependencies.
- Prioritize sustainable development.

Never:

- Recommend unnecessary features.
- Ignore architectural constraints.
- Ignore existing technical debt.
- Plan features without clear value.

---

# Inputs

Review:

- PROJECT_ANALYSIS.md
- ARCHITECTURE_ANALYSIS.md
- TECHNICAL_DEBT.md
- PROJECT_PROGRESS.md
- CONTEXT.md
- Existing documentation
- Repository structure

Use repository evidence before making recommendations.

---

# Product Vision Review

Startup Product Manager should evaluate:

- target users
- customer problems
- business goals
- market opportunity
- competitive positioning

Ensure roadmap aligns with long-term vision.

---

# Current Project Status

Project Manager should summarize:

- completed work
- work in progress
- blocked work
- outstanding issues
- pending milestones

Provide an accurate project snapshot.

---

# Architecture Dependencies

Software Architect should identify:

- prerequisite work
- architectural constraints
- platform improvements
- scalability requirements

Ensure roadmap follows technical dependencies.

---

# Feature Prioritization

Evaluate every proposed feature using:

- user impact
- business value
- engineering effort
- implementation risk
- architectural readiness

Use a consistent prioritization framework such as:

- RICE
- ICE
- MoSCoW

Explain prioritization decisions.

---

# Technical Debt

Identify work related to:

- refactoring
- code cleanup
- dependency updates
- documentation
- testing
- security
- performance

Include technical debt alongside new features.

---

# Infrastructure Planning

Review:

- CI/CD
- monitoring
- deployment
- scalability
- backups
- observability

Recommend infrastructure improvements where needed.

---

# AI & Data Roadmap

Evaluate future work involving:

- ML models
- data pipelines
- feature engineering
- climate intelligence
- satellite imagery
- model deployment
- experiment tracking

Prioritize based on project goals.

---

# Milestones

Organize work into milestones such as:

Milestone 1

Foundation

Milestone 2

Core Platform

Milestone 3

AI Integration

Milestone 4

Optimization

Milestone 5

Production Readiness

Milestone 6

Public Release

Each milestone should include:

- objectives
- deliverables
- dependencies
- success criteria

---

# Timeline

Divide work into:

Immediate (Next 1–2 weeks)

Short-term (1–2 months)

Medium-term (3–6 months)

Long-term (6+ months)

Do not assign unrealistic timelines.

---

# Risks

Identify risks related to:

- architecture
- staffing
- research
- infrastructure
- AI
- security
- scalability

Provide mitigation strategies.

---

# Success Metrics

Define measurable outcomes for each milestone.

Examples:

- Feature completion
- Test coverage
- API performance
- Model accuracy
- Deployment success
- Documentation completeness

---

# Deliverables

Generate or update:

ROADMAP.md

FEATURE_BACKLOG.md

MILESTONES.md

PRODUCT_VISION.md

PRIORITY_MATRIX.md

PROJECT_PROGRESS.md

CONTEXT.md

Merge updates intelligently.

---

# Final Report Format

Produce:

## Executive Summary

## Current Project Status

## Product Vision

## Key Objectives

## Priority Matrix

## Milestones

## Immediate Priorities

## Short-Term Goals

## Medium-Term Goals

## Long-Term Vision

## Technical Debt

## Infrastructure Improvements

## AI Roadmap

## Risks

## Success Metrics

## Recommended Next Steps

---

# Quality Checklist

Before finishing verify:

✓ repository analysis reviewed

✓ architecture reviewed

✓ priorities evidence-based

✓ milestones defined

✓ dependencies identified

✓ technical debt included

✓ AI roadmap documented

✓ timelines realistic

✓ risks documented

✓ documentation updated

✓ project progress updated

✓ context updated

---

# Success Criteria

This command succeeds only if:

- The project has a clear execution roadmap.
- Every recommendation has a justified priority.
- Technical and business goals are aligned.
- Milestones are achievable.
- Dependencies are documented.
- Future work is clearly organized.
- Documentation is synchronized.

---

# End Goal

Produce a strategic roadmap that guides the project from its current state to a scalable, production-ready platform through clear priorities, realistic milestones, and evidence-based planning.