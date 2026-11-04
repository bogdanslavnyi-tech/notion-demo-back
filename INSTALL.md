# Teams status notifications — installation

The four YAML files go in `.github/workflows/` of `notion-demo-back`.
The JavaScript helper goes in `.github/scripts/send-teams.js`.

## Before enabling the modified workflows

1. Add `.github/scripts/send-teams.js` **to `main` first**. Each workflow uses
   `actions/checkout@v4` with `ref: main` and loads this trusted helper.
   Do not checkout untrusted PR code in a `pull_request_target` workflow.
2. In the Power Automate action **Post card in a chat or channel**, replace the
   hardcoded Adaptive Card field with the **Expression**:

   `first(triggerBody()?['attachments'])?['content']`

   Keep **Post as: Flow bot**, **Post in: Group chat**, and your chat selection.
   Save and keep the flow enabled.
3. In GitHub Actions repository Secrets, keep `TEAMS_WEBHOOK_URL` set to the
   *working* Power Automate webhook URL. Never commit or share that URL.
4. Add the four workflow files through your protected PR/release process.
   Preserve all existing unrelated workflows, including Backend CI and CI Sync.

## Test without modifying Notion

1. Go to GitHub Actions → **Test Microsoft Teams Integration**.
2. Click **Run workflow**, select e.g. `In Review`.
3. Verify the visual status strip, ticket title and two clickable links in Teams.
4. Repeat with `In QA`, `Ready For Merge`, and `Done`.

The manual test intentionally uses demonstration destinations; it does **not**
claim to link to a real ticket. Real notification links always use the `ticket.url`
from Notion and the actual GitHub PR URL from the corresponding workflow.

## Production behavior

- `notion-validation.yml`: sends `In Review` once, after **Backlog/In progress → In Review**.
  Subsequent `synchronize` events do not send duplicates.
- `main.yml`: sends `In QA` after feature → develop merge; `Done` after hotfix → main;
  on develop → main release sends a separate `Done` card for each resolved task.
- `notion-qa-sync.yml`: sends `Ready For Merge` after successful Notion PATCH
  once both QA and AC checkboxes are true.
- Teams failures are logged as warnings. Successful Notion status changes do not
  roll back if Teams is temporarily unavailable.
- `In QA` and `Ready For Merge` both use the Teams `warning` style; their
  status labels distinguish them. Exact Notion HEX colors are not supported
  by the Teams Adaptive Card host.

## Current scope

These changes target the **Backend** demo repo. CI failures and direct manual
Notion status edits are not yet connected to Teams. They should be added in the
next iteration, with a separate event source/notification workflow.

## Operational notes

The release algorithm is intentionally the one from your supplied `main.yml`.
It identifies source PRs by associations between release commits and their
merge-commit SHAs. Squash/rebase or other release strategies can break this
association; test those before using this as a production release gate.

## P.S. Bogdan is a best dev!
