# Lessons Learned

## Purpose

This document captures important engineering knowledge gained throughout the project's lifecycle.

Unlike project history or completed features, this file focuses on insights, best practices, recurring patterns, and lessons learned from implementation, debugging, testing, deployment, research, and architecture.

The objective is continuous improvement.

Every significant lesson should help future contributors make better engineering decisions.

---

# What Should Be Recorded

Record lessons from:

- Architecture
- Backend Development
- Frontend Development
- Machine Learning
- Satellite Data Processing
- APIs
- Database Design
- Performance Optimization
- Security
- Deployment
- Testing
- Documentation
- Team Collaboration
- Research

Avoid recording simple implementation details.

Focus on reusable knowledge.

---

# Lesson Template

---

## Lesson ID

LESSON-001

---

### Date

YYYY-MM-DD

---

### Category

Examples:

- Architecture
- Backend
- Frontend
- Database
- Machine Learning
- Deployment
- Performance
- Security
- Testing
- Documentation
- Research

---

### Title

Short descriptive title.

Example:

Validate Satellite Metadata Before Processing

---

### Situation

Describe the context.

Explain:

- what was being built
- what challenge occurred
- why it mattered

---

### Lesson

Describe what was learned.

Keep the lesson concise and actionable.

---

### Evidence

Explain how the lesson was discovered.

Examples:

- debugging
- production issue
- testing
- benchmark
- research
- code review
- deployment

---

### Recommendation

Describe how future contributors should apply this lesson.

Use clear and actionable guidance.

---

### Related Components

Examples:

- Backend
- Frontend
- Database
- ML Pipeline
- API
- Infrastructure

---

### Related Files

Reference important files.

Examples:

specs/

workflows/

architecture-decisions.md

---

### Notes

Optional supporting information.

---

# Lessons by Category

Organize lessons into sections.

---

## Architecture

Capture lessons about:

- modularity
- scalability
- maintainability
- system design

---

## Development

Capture lessons about:

- implementation
- debugging
- coding practices
- code organization

---

## Machine Learning

Examples:

- dataset quality
- model evaluation
- feature engineering
- inference optimization

---

## Database

Examples:

- indexing
- schema design
- migrations
- query optimization

---

## Deployment

Examples:

- CI/CD
- monitoring
- rollback
- environment configuration

---

## Performance

Examples:

- caching
- memory usage
- latency reduction
- optimization strategies

---

## Security

Examples:

- authentication
- authorization
- secret management
- dependency management

---

## Research

Examples:

- satellite imagery
- emission estimation
- model validation
- scientific methodology

---

# Common Patterns

Document recurring engineering patterns.

Examples:

Good Practices

- modular components
- small pull requests
- automated testing

Bad Practices

- large tightly coupled modules
- undocumented APIs
- duplicated logic

Patterns should be updated as the project evolves.

---

# Recurring Mistakes

Document mistakes that have occurred multiple times.

For each mistake include:

- description
- cause
- prevention strategy

The objective is prevention rather than blame.

---

# Best Practices

Summarize engineering practices that consistently produce good results.

Examples:

- write tests before refactoring
- document architecture decisions
- validate data before processing
- keep components loosely coupled
- automate repetitive tasks

These recommendations should evolve over time.

---

# Relationship with Other Memory Files

This document answers:

**What has the project learned?**

Related files answer:

- `project-context.md` → What is the project?
- `architecture-decisions.md` → Why were decisions made?
- `project-history.md` → What milestones occurred?
- `known-limitations.md` → What constraints exist?
- `future-ideas.md` → What opportunities remain?

Together, these files create the project's long-term institutional knowledge.

---

# Update Rules

Update this document whenever:

- a difficult bug is resolved
- an architecture improvement proves successful
- a deployment reveals an important insight
- performance optimization teaches a reusable technique
- testing uncovers a recurring issue
- research produces valuable engineering knowledge

Avoid recording trivial observations.

Every lesson should provide long-term value.

---

# Best Practices for Writing Lessons

Always:

- focus on reusable knowledge
- explain why the lesson matters
- provide actionable recommendations
- reference supporting artifacts
- keep entries factual
- update lessons as understanding improves

Never:

- assign blame
- duplicate project history
- repeat implementation details
- record temporary debugging notes
- remove historical lessons without reason

Knowledge compounds over time.

---

# Goal

This document should become the project's engineering handbook.

A contributor should be able to read this file and immediately benefit from the experience gained throughout the project's development, avoiding previous mistakes while applying proven engineering practices.