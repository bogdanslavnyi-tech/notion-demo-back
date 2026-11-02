
# Test Complete Notion ↔ GitHub Automation Workflow

## Description

Validate the complete automated development lifecycle between **Notion** and **GitHub** using the `notion-demo-back` repository.

The goal is to automate task management, branch creation, pull requests, CI/CD validation, QA approval, and production releases.

**Notion** acts as the single source of truth for tasks and approvals, while **GitHub** manages source code, CI/CD, reviews, and merge protection.

---

## 1. Branch Creation

- [ ] Generate the branch name automatically using Notion Formula.
- [ ] Create a feature branch from `develop` using the `Create Git Branch` button.
- [ ] Verify that the branch exists in GitHub.
- [ ] Automatically save the branch name in Notion.
- [ ] Move the task from `Backlog` to `In Progress`.
- [ ] Prevent duplicate branch creation.
- [ ] Detect mismatches between the generated and existing branch names.

**Expected result:**

```text
Notion Task → Create Branch → GitHub Branch → In Progress
```

## 2. Pull Request Validation

- [ ] Create a Pull Request targeting `develop`.
- [ ] Extract the Task ID from the branch name.
- [ ] Verify that the Notion ticket exists.
- [ ] Validate the associated repository.
- [ ] Automatically add the Notion ticket link to the PR description.
- [ ] Save the PR URL in Notion.
- [ ] Automatically move the task to `In Review`.

**Expected result:**

```text
Feature Branch → PR to develop → Notion: In Review
```

## 3. CI/CD Validation

- [ ] Run ESLint checks.
- [ ] Run unit tests.
- [ ] Run the application build.
- [ ] Synchronize successful CI results with Notion.
- [ ] Synchronize failed CI results with Notion.
- [ ] Prevent outdated CI results from overwriting newer results.

**Expected result:**

| CI Result | Notion CI Status |
|-----------|------------------|
| Success   | Passed           |
| Failure   | Failed           |

## 4. Development Merge

- [ ] Approve the feature Pull Request.
- [ ] Merge the PR into `develop`.
- [ ] Detect the successful merge event.
- [ ] Automatically move the Notion ticket to `In QA`.
- [ ] Ensure closing a PR without merging does not change the task status.

**Expected result:**

```text
PR Approved → Merge into develop → Notion: In QA
```

## 5. QA Validation

- [ ] Verify all Acceptance Criteria.
- [ ] Set `QA Status` to `Passed`.
- [ ] Confirm `QA Approved`.
- [ ] Confirm `AC Approved`.
- [ ] Verify approval against the tested commit SHA.
- [ ] Automatically move the ticket to `Ready For Merge`.
- [ ] Block release if QA approval is missing or revoked.

**Expected result:**

```text
In QA → QA Passed → Ready For Merge
```

## 6. Production Release

- [ ] Create a release PR from `develop` to `main`.
- [ ] Identify all tickets included in the release.
- [ ] Verify that all tickets have QA approval.
- [ ] Verify that all tickets are in `Ready For Merge`.
- [ ] Run required CI checks.
- [ ] Block merge if any requirement fails.
- [ ] Merge the approved release PR into `main`.
- [ ] Automatically move released tickets to `Done`.

**Expected result:**

```text
develop → Release Validation → main → Notion: Done
```

---

## Acceptance Criteria

- [ ] Branch creation works directly from Notion.
- [ ] Branches are created from `develop`.
- [ ] Duplicate branches are not created.
- [ ] GitHub PRs are automatically linked to Notion tickets.
- [ ] Notion task statuses update automatically.
- [ ] CI results synchronize correctly.
- [ ] Merge into `develop` triggers `In QA`.
- [ ] QA approval is required before production release.
- [ ] Failed QA blocks the production merge.
- [ ] Merge into `main` triggers `Done`.
- [ ] Repeated events do not produce duplicate or incorrect updates.

---

## Definition of Done

The automation is considered complete when the entire workflow can be executed without manually updating technical task statuses or copying GitHub links.

### Required Workflow

1. **Backlog** — Task created in Notion.
2. **In Progress** — GitHub branch created from `develop`.
3. **In Review** — Pull Request opened.
4. **In QA** — Pull Request merged into `develop`.
5. **Ready For Merge** — QA approved all requirements.
6. **Done** — Release merged into `main`.

### Final Goal

Build a reusable, secure, and scalable automation system that can be applied to multiple repositories:

- `notion-demo-front` — React
- `notion-demo-back` — NestJS
- `notion-demo-mobile` — React Native

**No third-party automation platforms required.**
