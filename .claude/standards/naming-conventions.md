---
name: naming-conventions
description: Defines universal naming conventions for source code, APIs, databases, infrastructure, AI components, documentation, and project artifacts to ensure consistency, readability, and maintainability.
version: 1.0
owner: software-architect
---

# Naming Conventions

## Purpose

Consistent naming is one of the most effective ways to improve code readability and maintainability.

This document defines naming standards for every part of the project regardless of programming language, framework, or technology stack.

Names should communicate intent clearly without requiring additional explanation.

---

# Core Principles

Every name should be:

- Descriptive
- Consistent
- Predictable
- Searchable
- Concise
- Domain-focused

Avoid abbreviations unless they are universally understood.

---

# General Rules

Always:

- use meaningful names
- prefer complete words
- keep terminology consistent
- follow language conventions
- use singular names for individual entities
- use plural names for collections

Never:

- use vague names
- invent inconsistent abbreviations
- include implementation details in names
- encode data types into identifiers

---

# Variables

Variable names should describe the data they contain.

Good examples:

```text
user
userProfile
totalRevenue
averageTemperature
requestTimeout
```

Poor examples:

```text
x
temp
data1
obj
val
```

Avoid single-letter variables except for short-lived loop counters.

---

# Constants

Constants should clearly indicate immutable values.

Examples:

```text
MAX_RETRY_COUNT
DEFAULT_TIMEOUT
EARTH_RADIUS_KM
API_VERSION
```

Constants should never contain magic numbers without explanation.

---

# Functions

Functions should describe what they do.

Examples:

```text
calculateCarbonEmission()
fetchUserProfile()
validateInput()
generateReport()
```

Boolean-returning functions should begin with words such as:

```text
is
has
can
should
supports
```

Examples:

```text
isAuthenticated()
hasPermission()
canDeploy()
```

---

# Classes

Class names should represent nouns.

Examples:

```text
UserService
EmissionCalculator
ProjectManager
DatabaseConnection
```

Avoid names ending with generic terms such as:

```text
Manager
Helper
Util
Stuff
Misc
```

unless they accurately describe the responsibility.

---

# Interfaces

Interfaces should represent capabilities.

Examples:

```text
Repository
StorageProvider
AuthenticationService
NotificationSender
```

Use project-specific language conventions where appropriate.

---

# Files

File names should:

- describe their contents
- remain predictable
- match project conventions

Examples:

```text
user-service.ts
api-client.py
database.go
auth_controller.rs
```

Avoid names such as:

```text
new.py
final.js
test2.ts
misc.java
```

---

# Directories

Directory names should represent logical modules.

Examples:

```text
controllers
services
repositories
models
components
workflows
standards
```

Avoid deeply nested directory structures without clear boundaries.

---

# API Endpoints

Endpoints should:

- use nouns
- remain resource-oriented
- avoid verbs where practical

Good:

```text
GET /users
POST /users
GET /projects/{id}
```

Avoid:

```text
/getUsers
/createProject
/deleteItem
```

---

# Database Objects

Tables:

```text
users
projects
emissions
satellite_images
```

Columns:

```text
created_at
updated_at
user_id
project_name
```

Primary keys:

```text
id
```

Foreign keys:

```text
user_id
project_id
organization_id
```

---

# Environment Variables

Environment variables should be uppercase.

Examples:

```text
DATABASE_URL
API_KEY
OPENAI_MODEL
REDIS_HOST
JWT_SECRET
```

Group related variables using prefixes where appropriate.

---

# Branch Names

Examples:

```text
feature/user-authentication
feature/co2-prediction

bugfix/login-timeout

hotfix/security-patch

refactor/database-layer

docs/api-reference

release/v1.4.0
```

Keep branch names short but descriptive.

---

# Git Commits

Commit messages should be concise and action-oriented.

Examples:

```text
Add satellite imagery preprocessing

Fix authentication timeout

Refactor emissions pipeline

Update deployment documentation
```

Detailed commit conventions are defined in:

commit-conventions.md

---

# Tests

Test names should clearly describe expected behavior.

Examples:

```text
shouldCalculateAverageEmission()

shouldRejectInvalidToken()

shouldReturnEmptyResultsWhenDatasetIsMissing()
```

Readers should understand the expected behavior without reading the implementation.

---

# AI Components

Models

Examples:

```text
BrainAgePredictor

CO2Estimator

LandCoverClassifier
```

Pipelines

Examples:

```text
ImageProcessingPipeline

EmissionPredictionPipeline
```

Avoid version numbers inside identifiers unless multiple active versions exist.

---

# Documentation

Documentation names should clearly describe their purpose.

Examples:

```text
ARCHITECTURE.md

API.md

ROADMAP.md

CHANGELOG.md

PROJECT_PROGRESS.md

SECURITY_REPORT.md
```

Follow consistent naming throughout the repository.

---

# Reserved Terms

Use consistent project terminology.

Prefer one canonical term for each concept.

Examples:

Use:

```text
Project
User
Dataset
Emission
Satellite Image
Prediction
Workflow
Sprint
```

Avoid mixing synonyms for the same concept.

---

# Naming Checklist

Verify:

✓ descriptive

✓ consistent

✓ searchable

✓ domain-specific

✓ language appropriate

✓ no unnecessary abbreviations

✓ follows project standards

---

# Success Criteria

Naming conventions succeed when:

✓ engineers understand identifiers immediately

✓ terminology remains consistent

✓ navigation becomes intuitive

✓ documentation matches implementation

✓ searchability improves

✓ onboarding becomes easier

---

# Related Standards

- coding-standards.md
- architecture-principles.md
- git-workflow.md
- commit-conventions.md
- documentation-standards.md

---

# Exceptions

Exceptions require documented architectural justification.

Do not introduce inconsistent naming solely to preserve legacy code unless migration risk outweighs the benefit.

---

# End Goal

Create a codebase where every identifier clearly communicates its purpose, follows consistent project-wide conventions, and enables engineers, reviewers, AI agents, and future contributors to understand the system quickly with minimal cognitive overhead.