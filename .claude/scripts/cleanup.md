---
name: cleanup
description: Generate safe cleanup automation for development environments, build artifacts, caches, logs, temporary files, containers, and other disposable resources.
version: 1.0
owner: devops-engineer

agents:
  - devops-engineer
  - software-architect
  - backend-engineer
  - frontend-engineer
  - documentation-engineer

commands:
  - cleanup
  - review

workflows:
  - optimization
  - deployment

standards:
  - documentation-standards
  - architecture-principles

outputs:
  - CLEANUP_REPORT.md
  - STORAGE_ANALYSIS.md
  - PROJECT_PROGRESS.md
---

# Cleanup Script Prompt

## Mission

Generate cleanup automation that safely removes unnecessary files and resources while preserving project integrity.

Cleanup should:

- recover storage
- improve build consistency
- remove stale artifacts
- keep repositories organized

Never delete source code or important project assets.

---

# Phase 1 — Analyze the Project

Inspect:

- repository structure
- build directories
- package manager caches
- dependency caches
- log directories
- temporary files
- generated assets
- container resources

Generate:

STORAGE_ANALYSIS.md

Estimate recoverable storage.

---

# Phase 2 — Classify Resources

Categorize resources.

Safe to Remove

- build artifacts
- cache files
- temporary files
- generated reports
- old logs
- package caches

Review Before Removal

- downloaded datasets
- uploaded files
- backups
- exported reports

Never Remove

- source code
- migrations
- configuration
- documentation
- environment templates
- project assets
- version control data

---

# Phase 3 — Build Cleanup

Generate cleanup for:

- build/
- dist/
- out/
- target/
- coverage/
- .next/
- generated files

Remove only reproducible artifacts.

---

# Phase 4 — Dependency Cleanup

Clean:

Node

- node_modules cache
- npm cache
- pnpm cache
- yarn cache

Python

- __pycache__
- .pytest_cache
- .mypy_cache
- pip cache
- virtual environment caches (only when requested)

Other

- language-specific caches
- package manager temporary files

Never remove dependency manifests.

---

# Phase 5 — Container Cleanup

Clean:

- stopped containers
- unused images
- dangling volumes
- unused networks
- build cache

Never remove actively used containers.

---

# Phase 6 — Log Cleanup

Archive or remove:

- application logs
- debug logs
- old deployment logs
- temporary reports

Preserve logs required for auditing or debugging.

---

# Phase 7 — Validation

Verify:

- project still builds
- dependencies remain valid
- repository integrity preserved
- critical files untouched

Generate:

CLEANUP_REPORT.md

Include:

- files removed
- storage reclaimed
- warnings
- skipped items

---

# Phase 8 — Documentation

Generate:

- CLEANUP_REPORT.md
- STORAGE_ANALYSIS.md

Update:

PROJECT_PROGRESS.md

Document:

- cleanup performed
- recovered storage
- remaining cleanup opportunities

---

# Deliverables

Produce:

- cleanup.sh (or platform equivalent)
- CLEANUP_REPORT.md
- STORAGE_ANALYSIS.md
- PROJECT_PROGRESS.md

---

# Cleanup Principles

Always:

- analyze before deleting
- preserve important data
- remove only reproducible artifacts
- verify project integrity afterward
- summarize reclaimed storage

Never:

- delete source code
- delete Git history
- delete environment templates
- delete databases without explicit approval
- remove production data
- perform destructive cleanup without confirmation

---

# Safety Checklist

Before deleting anything verify:

- item is reproducible
- item is not tracked source code
- item is not required for deployment
- item is not a backup
- item is not user-generated content
- cleanup can be safely repeated

---

# Definition of Done

Cleanup automation is complete only when:

- unnecessary files are identified
- safe cleanup script is generated
- storage analysis is documented
- project integrity is verified
- cleanup report is produced
- documentation is updated