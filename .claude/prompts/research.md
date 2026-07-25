---
name: research
description: Conduct comprehensive, evidence-based research to evaluate technologies, architectures, products, scientific literature, and engineering decisions.
version: 1.0
owner: research-engineer

agents:
  - research-engineer
  - software-architect
  - startup-product-manager
  - ml-engineer
  - backend-engineer
  - data-engineer
  - prompt-engineer
  - documentation-engineer

workflows:
  - architecture-review
  - feature-development
  - sprint-planning

commands:
  - analyze
  - architecture
  - roadmap
  - document

standards:
  - architecture-principles
  - documentation-standards
  - coding-standards

outputs:
  - RESEARCH_REPORT.md
  - LITERATURE_REVIEW.md
  - TECHNOLOGY_COMPARISON.md
  - FEASIBILITY_STUDY.md
  - RECOMMENDATIONS.md
  - PROJECT_PROGRESS.md
  - CONTEXT.md
---

# Research Prompt

## Mission

Conduct rigorous, evidence-based research before making technical, scientific, product, or architectural recommendations.

Research should prioritize:

- accuracy
- objectivity
- reproducibility
- technical depth
- practical relevance

Recommendations should be supported by evidence, comparisons, and clearly documented trade-offs.

---

# Phase 1 — Understand the Research Question

Clearly define:

- research objective
- scope
- constraints
- assumptions
- stakeholders
- expected outcome

If the problem is ambiguous, identify missing information or propose reasonable assumptions.

---

# Phase 2 — Background Research

Gather background information.

Identify:

- existing knowledge
- domain concepts
- terminology
- historical context
- current state of the field

Summarize foundational concepts before analyzing solutions.

---

# Phase 3 — Define Evaluation Criteria

Establish objective criteria.

Examples:

Technical

- performance
- scalability
- reliability
- maintainability
- interoperability

Business

- cost
- adoption
- ecosystem
- licensing
- maturity

Research

- novelty
- reproducibility
- citation quality
- experimental validation

User

- usability
- accessibility
- learning curve

Document how every candidate will be evaluated.

---

# Phase 4 — Explore Candidate Solutions

Identify multiple viable approaches.

Examples:

- technologies
- frameworks
- algorithms
- architectures
- methodologies
- products
- research papers

Avoid limiting research to a single solution.

---

# Phase 5 — Comparative Analysis

Compare every candidate.

Evaluate:

- strengths
- weaknesses
- trade-offs
- implementation complexity
- scalability
- security
- performance
- community support
- long-term viability

Generate:

TECHNOLOGY_COMPARISON.md

Use tables whenever appropriate.

---

# Phase 6 — Literature Review

Review relevant:

- research papers
- technical reports
- standards
- documentation
- benchmarks
- industry publications

Generate:

LITERATURE_REVIEW.md

Summarize:

- major findings
- methodologies
- limitations
- open research questions

Differentiate established evidence from emerging ideas.

---

# Phase 7 — Feasibility Study

Evaluate feasibility from multiple perspectives.

Technical

- implementation effort
- infrastructure
- integration complexity

Business

- development cost
- operational cost
- ROI
- market readiness

Operational

- deployment
- maintenance
- monitoring
- support

Generate:

FEASIBILITY_STUDY.md

---

# Phase 8 — Risk Assessment

Identify risks.

Examples:

Technical

Business

Legal

Operational

Security

Performance

Research uncertainty

For every risk include:

- likelihood
- impact
- mitigation strategy

---

# Phase 9 — Recommendation

Recommend the strongest solution.

Explain:

- why it was selected
- expected benefits
- trade-offs
- implementation risks
- required resources
- estimated timeline
- future evolution

Generate:

RECOMMENDATIONS.md

Recommendations should be supported by evidence—not preference.

---

# Phase 10 — Research Gaps & Future Work

Identify:

- unanswered questions
- missing data
- experimental opportunities
- future improvements
- long-term research directions

Encourage continuous learning rather than treating research as complete.

---

# Phase 11 — Documentation

Generate:

- RESEARCH_REPORT.md
- LITERATURE_REVIEW.md
- TECHNOLOGY_COMPARISON.md
- FEASIBILITY_STUDY.md
- RECOMMENDATIONS.md

Update:

- PROJECT_PROGRESS.md
- CONTEXT.md

Document:

- assumptions
- references
- evaluation criteria
- conclusions
- limitations

---

# Deliverables

Produce or update:

- RESEARCH_REPORT.md
- LITERATURE_REVIEW.md
- TECHNOLOGY_COMPARISON.md
- FEASIBILITY_STUDY.md
- RECOMMENDATIONS.md
- PROJECT_PROGRESS.md
- CONTEXT.md

---

# Research Principles

Always:

- Begin with the research question.
- Evaluate multiple alternatives.
- Base conclusions on evidence.
- Distinguish facts from assumptions.
- Explain trade-offs transparently.
- Consider technical, business, and user perspectives.
- Document limitations and uncertainties.
- Cite authoritative sources whenever possible.

Never:

- Recommend the first solution without comparison.
- Treat opinions as evidence.
- Ignore contradictory findings.
- Hide uncertainty.
- Overlook practical implementation constraints.
- Present speculative claims as established facts.

---

# Decision Framework

Evaluate candidate solutions using:

1. Technical Merit
2. Scientific Evidence
3. Performance
4. Scalability
5. Security
6. Maintainability
7. Cost
8. Ecosystem Maturity
9. Time to Implement
10. Long-Term Sustainability

Use this framework to justify recommendations.

---

# Definition of Done

Research is complete only when:

- The research question is clearly defined.
- Background knowledge is documented.
- Multiple candidate solutions are evaluated.
- Relevant literature is reviewed.
- A feasibility study is completed.
- Risks and trade-offs are documented.
- Evidence-based recommendations are provided.
- Research gaps and future work are identified.
- Documentation is complete.
- Project progress and context are updated.