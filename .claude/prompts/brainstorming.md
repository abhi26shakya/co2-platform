---
name: brainstorming
description: Generate, evaluate, prioritize, and refine innovative ideas for products, features, architectures, research, and engineering challenges using structured ideation.
version: 1.0
owner: startup-product-manager

agents:
  - startup-product-manager
  - software-architect
  - research-engineer
  - ml-engineer
  - backend-engineer
  - frontend-engineer
  - ux-designer
  - prompt-engineer
  - documentation-engineer

workflows:
  - feature-development
  - sprint-planning
  - architecture-review

commands:
  - feature
  - architecture
  - roadmap
  - document

standards:
  - architecture-principles
  - documentation-standards

outputs:
  - BRAINSTORM.md
  - IDEA_PRIORITIZATION.md
  - FEASIBILITY_ANALYSIS.md
  - IMPLEMENTATION_ROADMAP.md
  - PROJECT_PROGRESS.md
  - CONTEXT.md
---

# Brainstorming Prompt

## Mission

Generate high-quality ideas before committing to a solution.

Explore broadly.

Evaluate critically.

Prioritize objectively.

Only recommend solutions after considering multiple alternatives.

The goal is not to produce the first idea.

The goal is to produce the best idea.

---

# Phase 1 — Understand the Problem

Before generating ideas, understand:

- objectives
- constraints
- users
- stakeholders
- business goals
- technical limitations
- available resources
- timeline

If important information is missing, identify assumptions or ask focused clarifying questions.

---

# Phase 2 — Define Success

Clearly define what success looks like.

Examples:

- faster workflow
- lower cost
- improved UX
- higher revenue
- better scalability
- research novelty
- engineering simplicity
- automation
- competitive advantage

Use these criteria to evaluate every idea.

---

# Phase 3 — Divergent Ideation

Generate a wide variety of ideas.

Explore:

- incremental improvements
- bold innovations
- unconventional approaches
- AI-native solutions
- automation opportunities
- workflow redesign
- architecture alternatives
- product variations
- business model options
- research directions

Avoid judging ideas too early.

Prioritize quantity before quality during this phase.

---

# Phase 4 — Categorize Ideas

Group ideas into themes.

Examples:

Product

Engineering

AI

Infrastructure

Research

Growth

Operations

Design

Developer Experience

Automation

Highlight relationships between ideas.

---

# Phase 5 — Evaluate Every Idea

For each idea assess:

- feasibility
- impact
- complexity
- cost
- implementation effort
- scalability
- maintainability
- technical risk
- business value
- user value

Identify major trade-offs.

Generate:

FEASIBILITY_ANALYSIS.md

---

# Phase 6 — Prioritize

Rank ideas using objective criteria.

Example dimensions:

- Impact
- Effort
- Innovation
- Risk
- Time to Build
- Strategic Value

Separate ideas into:

Quick Wins

High Impact Projects

Long-Term Bets

Experimental Ideas

Generate:

IDEA_PRIORITIZATION.md

---

# Phase 7 — Combine & Improve

Look for opportunities to:

- merge ideas
- simplify solutions
- remove unnecessary complexity
- strengthen weak concepts
- reuse existing systems
- maximize leverage

The best solution may combine several ideas.

---

# Phase 8 — Challenge Assumptions

Question:

- hidden assumptions
- technical constraints
- business assumptions
- user expectations
- architectural decisions

Ask:

"What if the opposite were true?"

"What would we build from scratch today?"

"What would a startup with no legacy constraints build?"

---

# Phase 9 — Competitive & Industry Perspective

Consider:

- existing solutions
- open-source alternatives
- emerging technologies
- industry best practices
- market gaps
- differentiators

Avoid reinventing mature solutions without a clear advantage.

---

# Phase 10 — Recommend the Best Direction

Recommend one or more approaches.

For each recommendation explain:

- why it was selected
- expected benefits
- trade-offs
- implementation risks
- required resources
- estimated timeline

Generate:

IMPLEMENTATION_ROADMAP.md

---

# Phase 11 — Documentation

Generate:

- BRAINSTORM.md
- IDEA_PRIORITIZATION.md
- FEASIBILITY_ANALYSIS.md
- IMPLEMENTATION_ROADMAP.md

Update:

- PROJECT_PROGRESS.md
- CONTEXT.md

---

# Deliverables

Produce or update:

- BRAINSTORM.md
- IDEA_PRIORITIZATION.md
- FEASIBILITY_ANALYSIS.md
- IMPLEMENTATION_ROADMAP.md
- PROJECT_PROGRESS.md
- CONTEXT.md

---

# Brainstorming Principles

Always:

- Explore multiple directions before choosing one.
- Encourage creativity while remaining grounded.
- Evaluate ideas using evidence and reasoning.
- Explain trade-offs transparently.
- Combine complementary ideas when beneficial.
- Consider technical, product, business, and user perspectives.
- Document assumptions explicitly.

Never:

- Commit to the first idea.
- Ignore obvious constraints.
- Over-engineer simple problems.
- Reject unconventional ideas without evaluation.
- Recommend solutions without comparing alternatives.

---

# Decision Framework

When comparing ideas, consider:

1. User Value
2. Business Value
3. Technical Feasibility
4. Scalability
5. Maintainability
6. Cost
7. Risk
8. Time to Deliver
9. Innovation Potential
10. Long-Term Strategic Value

Use this framework to justify recommendations.

---

# Definition of Done

Brainstorming is complete only when:

- The problem is clearly understood.
- Multiple solution paths have been explored.
- Ideas are categorized and evaluated.
- Trade-offs are documented.
- Recommendations are prioritized.
- An implementation roadmap is proposed.
- Documentation is complete.
- Project progress and context are updated.