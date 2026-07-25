# Code Review Checklist

## Purpose

This checklist ensures that every code review is consistent, thorough, and focused on correctness, maintainability, security, performance, and production readiness.

Every pull request should satisfy the applicable items before approval.

---

# 1. Requirements Verification

- [ ] The implementation satisfies the approved specification.
- [ ] Acceptance criteria are fully met.
- [ ] Feature scope is correct.
- [ ] No unrelated functionality was introduced.
- [ ] Edge cases have been addressed.
- [ ] Error handling is appropriate.

---

# 2. Architecture Review

- [ ] Solution follows the project architecture.
- [ ] Existing design patterns are respected.
- [ ] Components have clear responsibilities.
- [ ] Separation of concerns is maintained.
- [ ] Dependencies are appropriate.
- [ ] No unnecessary coupling introduced.

---

# 3. Code Quality

- [ ] Code is easy to understand.
- [ ] Naming is meaningful and consistent.
- [ ] Functions remain small and focused.
- [ ] Classes have single responsibilities.
- [ ] Duplicate logic has been removed.
- [ ] Dead or commented-out code has been removed.
- [ ] Magic values have been replaced with named constants where appropriate.

---

# 4. Maintainability

- [ ] Code is easy to extend.
- [ ] Project conventions are followed.
- [ ] Technical debt is minimized.
- [ ] Complex logic is documented.
- [ ] Future maintenance effort appears reasonable.

---

# 5. Backend Review

If applicable.

- [ ] Business logic is correct.
- [ ] Validation is implemented.
- [ ] Exceptions are handled correctly.
- [ ] API contracts remain consistent.
- [ ] Logging is appropriate.
- [ ] Database operations are efficient.

---

# 6. Frontend Review

If applicable.

- [ ] UI follows the design specification.
- [ ] Responsive behavior verified.
- [ ] Accessibility considered.
- [ ] Loading states implemented.
- [ ] Error states implemented.
- [ ] Empty states implemented.
- [ ] Components remain reusable.

---

# 7. Database Review

If applicable.

- [ ] Schema changes reviewed.
- [ ] Migrations are safe.
- [ ] Rollback strategy exists.
- [ ] Queries are efficient.
- [ ] Indexes reviewed.
- [ ] Constraints verified.

---

# 8. Security Review

- [ ] User input is validated.
- [ ] Authentication enforced where required.
- [ ] Authorization rules verified.
- [ ] Secrets are protected.
- [ ] Sensitive information is not exposed.
- [ ] Security best practices are followed.
- [ ] No obvious OWASP risks introduced.

---

# 9. Performance Review

- [ ] Performance regressions checked.
- [ ] Expensive operations minimized.
- [ ] Database queries optimized.
- [ ] Assets optimized.
- [ ] Caching considered where appropriate.
- [ ] Scalability impact evaluated.

---

# 10. Testing Review

- [ ] Unit tests included or updated.
- [ ] Integration tests updated if required.
- [ ] Existing tests pass.
- [ ] Manual testing completed.
- [ ] Regression testing performed.
- [ ] Edge cases verified.

---

# 11. Documentation Review

- [ ] Documentation updated.
- [ ] API documentation updated if needed.
- [ ] Architecture documentation updated if required.
- [ ] Changelog updated when appropriate.
- [ ] Comments explain intent rather than implementation.

---

# 12. Dependency Review

- [ ] New dependencies are justified.
- [ ] Dependency versions are appropriate.
- [ ] No unnecessary libraries introduced.
- [ ] License compatibility considered.
- [ ] Security implications reviewed.

---

# 13. Deployment Review

- [ ] Environment variables documented.
- [ ] Configuration changes reviewed.
- [ ] Migration plan verified.
- [ ] Rollback strategy exists.
- [ ] Deployment risk assessed.

---

# 14. Final Approval

Before approving:

- [ ] Build succeeds.
- [ ] Linting passes.
- [ ] Formatting is correct.
- [ ] No unresolved review comments remain.
- [ ] No debug code remains.
- [ ] No TODOs block production.
- [ ] Implementation is production ready.

---

# Approval Criteria

Approve the change only if:

- Requirements are satisfied.
- Architecture remains sound.
- Code quality is high.
- Security concerns are addressed.
- Performance is acceptable.
- Tests pass.
- Documentation is complete.
- Deployment risk is acceptable.

Otherwise, request changes with clear, actionable feedback.