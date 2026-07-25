---
name: accessibility
description: Defines accessibility principles, inclusive design practices, implementation guidelines, testing requirements, and compliance expectations for all user-facing software built using this engineering framework.
version: 1.0
owner: ux-designer
---

# Accessibility Standards

## Purpose

Accessibility ensures software can be used effectively by people with diverse abilities, technologies, and environments.

These standards establish accessibility as a core engineering requirement rather than an optional enhancement.

Accessibility should be considered throughout the software development lifecycle.

---

# Accessibility Philosophy

Accessibility should be:

- Inclusive
- Intentional
- Consistent
- Testable
- Maintainable
- Measurable

Accessible software benefits every user—not only users with disabilities.

---

# Guiding Principles

Design and implementation should prioritize:

- Perceivability
- Operability
- Understandability
- Robustness

These principles should influence every user interface decision.

---

# Inclusive Design

Design for a wide range of users, including those who may:

- use screen readers
- navigate with keyboards
- have limited vision
- have hearing impairments
- experience motor impairments
- experience cognitive differences
- use older devices
- access software under varying environmental conditions

Accessibility improves usability for everyone.

---

# Semantic Structure

Interfaces should use meaningful structure.

Examples include:

- headings
- navigation landmarks
- lists
- tables
- forms
- buttons

Structure should communicate meaning independently of visual presentation.

---

# Keyboard Accessibility

Every interactive feature should be usable using only a keyboard.

Verify:

- logical tab order
- visible focus indicators
- keyboard shortcuts do not conflict
- dialogs trap focus appropriately
- focus returns predictably after closing dialogs

No essential interaction should require a pointing device.

---

# Focus Management

Focus should always remain:

- visible
- predictable
- meaningful

After dynamic interface updates:

- preserve user context
- move focus intentionally when appropriate
- avoid unexpected focus changes

---

# Color and Contrast

Visual information should not rely solely on color.

Interfaces should:

- provide sufficient contrast
- support readable typography
- distinguish interactive elements clearly
- remain understandable in grayscale when practical

Color should enhance—not replace—communication.

---

# Typography

Text should be:

- readable
- scalable
- appropriately spaced
- responsive across devices

Avoid fixed font sizes that prevent user scaling.

---

# Images and Media

Provide meaningful alternatives for non-text content.

Examples:

- descriptive alternative text
- captions
- transcripts
- audio descriptions where appropriate

Decorative content should not create unnecessary noise for assistive technologies.

---

# Forms

Forms should include:

- clear labels
- descriptive instructions
- meaningful validation messages
- accessible error identification
- logical grouping of related fields

Users should understand how to complete forms without guesswork.

---

# Error Messages

Error messages should:

- identify the problem
- explain why it occurred
- suggest how to resolve it

Avoid vague messages such as:

```
Something went wrong.
```

Errors should help users recover successfully.

---

# Navigation

Navigation should be:

- consistent
- predictable
- discoverable
- usable with assistive technologies

Users should always understand where they are within the application.

---

# Responsive Design

Accessibility applies across:

- desktop
- tablet
- mobile
- large displays
- assistive devices

Responsive layouts should preserve usability at different viewport sizes and zoom levels.

---

# Motion and Animation

Animations should:

- support usability
- avoid unnecessary distraction
- respect user preferences for reduced motion
- never trigger discomfort or disorientation

Motion should communicate purpose.

---

# Time-Based Interactions

When interactions involve time limits:

- inform users
- provide extensions where appropriate
- avoid unnecessary expiration
- preserve user progress whenever practical

Time constraints should not create avoidable barriers.

---

# Assistive Technology Compatibility

Interfaces should remain compatible with common assistive technologies.

Examples include:

- screen readers
- screen magnifiers
- voice control software
- alternative input devices

Avoid implementation patterns that interfere with assistive technology.

---

# Accessibility Testing

Accessibility should be evaluated using:

- automated analysis
- manual review
- keyboard-only testing
- screen reader testing where appropriate
- responsive testing
- usability testing

Automated tools complement—but do not replace—manual evaluation.

---

# Documentation

Accessibility documentation should include:

- supported accessibility features
- known limitations
- testing approach
- design decisions
- user guidance where applicable

Documentation should remain synchronized with implementation.

---

# Continuous Integration

Where practical, CI pipelines should include:

- accessibility analysis
- HTML validation
- automated accessibility checks

Accessibility regressions should be reviewed before release.

---

# AI-Assisted Development

AI-generated interfaces should:

- follow accessibility standards
- use semantic structures
- avoid inaccessible patterns
- undergo accessibility review

AI-generated code should never bypass accessibility requirements.

---

# Accessibility Checklist

Verify:

✓ semantic structure implemented

✓ keyboard navigation complete

✓ focus management correct

✓ sufficient color contrast

✓ readable typography

✓ accessible forms

✓ meaningful error messages

✓ responsive layout verified

✓ assistive technology compatibility considered

✓ accessibility testing completed

---

# Success Criteria

Accessibility succeeds when:

✓ users can complete core workflows regardless of input method

✓ interfaces remain understandable across devices

✓ accessibility regressions are prevented

✓ assistive technologies function correctly

✓ inclusive design becomes part of everyday engineering

---

# Related Standards

- documentation-standards.md
- testing-standards.md
- code-review-checklist.md
- architecture-principles.md
- coding-standards.md

---

# Exceptions

Accessibility exceptions require:

- documented justification
- assessment of user impact
- mitigation plan
- approval from the UX Designer

Exceptions should be temporary and reviewed regularly.

---

# End Goal

Build software that is inclusive, usable, and resilient by embedding accessibility into every stage of design, engineering, testing, and maintenance, ensuring that all users can effectively interact with the system regardless of ability, device, or interaction method.