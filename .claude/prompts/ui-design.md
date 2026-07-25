---
name: ui-design
description: Design intuitive, accessible, responsive, and production-ready user interfaces that align with the product vision and design system.
version: 1.0
owner: ux-designer

agents:
  - ux-designer
  - frontend-engineer
  - software-architect
  - startup-product-manager
  - performance-engineer
  - qa-engineer
  - documentation-engineer

workflows:
  - feature-development
  - architecture-review
  - documentation

commands:
  - feature
  - architecture
  - review
  - document

standards:
  - accessibility
  - architecture-principles
  - coding-standards
  - documentation-standards
  - performance-guidelines

outputs:
  - UI_SPEC.md
  - DESIGN_SYSTEM.md
  - COMPONENT_MAP.md
  - USER_FLOW.md
  - WIREFRAMES.md
  - PROJECT_PROGRESS.md
  - CONTEXT.md
---

# UI Design Prompt

## Mission

Design production-quality user interfaces that are:

- intuitive
- accessible
- responsive
- visually consistent
- scalable
- performant
- easy to maintain

Design the user experience before implementing the interface.

---

# Phase 1 — Understand the Product

Review:

- Feature Request
- Design Document
- Architecture Review
- User Stories

Determine:

- target users
- user goals
- business objectives
- pain points
- success criteria

Avoid designing without understanding the user.

---

# Phase 2 — User Flow

Design the complete user journey.

Document:

- entry points
- navigation
- primary actions
- decision points
- exit points
- error flows

Generate:

USER_FLOW.md

---

# Phase 3 — Information Architecture

Organize:

- pages
- navigation
- content hierarchy
- menus
- search
- breadcrumbs

Ensure information is easy to discover.

---

# Phase 4 — Screen Design

For every screen define:

- purpose
- layout
- hierarchy
- primary actions
- secondary actions
- empty states
- loading states
- error states

Generate:

WIREFRAMES.md

---

# Phase 5 — Component Design

Identify reusable components.

Examples:

- Buttons
- Cards
- Forms
- Tables
- Modals
- Navigation
- Dialogs
- Charts

Generate:

COMPONENT_MAP.md

Avoid duplicated UI patterns.

---

# Phase 6 — Design System

Define:

- typography
- spacing
- colors
- icons
- elevation
- border radius
- shadows
- motion
- component variants

Generate:

DESIGN_SYSTEM.md

Maintain consistency across the application.

---

# Phase 7 — Responsive Design

Design for:

- mobile
- tablet
- desktop
- large screens

Define layout changes for each breakpoint.

Ensure the experience remains usable on all supported devices.

---

# Phase 8 — Accessibility

Verify compliance with accessibility standards.

Review:

- semantic HTML
- keyboard navigation
- focus management
- color contrast
- screen reader support
- ARIA attributes
- touch target sizes

Accessibility is required—not optional.

---

# Phase 9 — Interaction Design

Define:

- hover states
- focus states
- active states
- disabled states
- transitions
- animations
- micro-interactions

Animations should enhance usability rather than distract from it.

---

# Phase 10 — Performance

Design with performance in mind.

Minimize:

- unnecessary rendering
- large assets
- layout shifts
- blocking resources
- excessive animations

Prioritize fast loading and smooth interactions.

---

# Phase 11 — Error Handling

Design user experiences for:

- validation errors
- API failures
- network issues
- permissions
- offline scenarios
- empty results

Every failure should provide clear guidance to the user.

---

# Phase 12 — Frontend Architecture

Recommend:

- component hierarchy
- folder structure
- state management
- reusable hooks
- styling approach
- routing strategy

Ensure the UI architecture aligns with the overall system architecture.

---

# Phase 13 — Testing Strategy

Plan testing for:

- components
- user flows
- accessibility
- responsiveness
- cross-browser compatibility
- visual regressions

Define acceptance criteria for the UI.

---

# Phase 14 — Documentation

Generate:

- UI_SPEC.md
- DESIGN_SYSTEM.md
- COMPONENT_MAP.md
- USER_FLOW.md
- WIREFRAMES.md

Document:

- component usage
- design decisions
- interaction patterns
- accessibility considerations

---

# Phase 15 — Final Review

Verify the UI is:

- intuitive
- accessible
- responsive
- consistent
- maintainable
- performant
- fully documented

Update:

PROJECT_PROGRESS.md

Update:

CONTEXT.md

---

# Deliverables

Produce or update:

- UI_SPEC.md
- DESIGN_SYSTEM.md
- COMPONENT_MAP.md
- USER_FLOW.md
- WIREFRAMES.md
- PROJECT_PROGRESS.md
- CONTEXT.md

---

# UI Design Principles

Always:

- Design for users first.
- Keep interfaces simple.
- Reuse components.
- Maintain visual consistency.
- Follow accessibility standards.
- Optimize for responsiveness.
- Document design decisions.

Never:

- Design without understanding user goals.
- Introduce inconsistent UI patterns.
- Ignore accessibility.
- Overuse animations.
- Duplicate components.
- Sacrifice usability for aesthetics.

---

# Definition of Done

The UI design is complete only when:

- User journeys are documented.
- Information architecture is defined.
- Screens are designed.
- Components are identified.
- A design system exists.
- Accessibility has been reviewed.
- Responsiveness has been planned.
- Performance considerations are addressed.
- Documentation is complete.
- Project progress and context are updated.