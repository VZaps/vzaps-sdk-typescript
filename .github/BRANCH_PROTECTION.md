# Branch protection setup

Apply these settings on GitHub after the first CI workflow runs on `main`.

## Required settings

- Default branch: `main`
- Require pull request before merging
- Require status checks to pass:
  - TypeScript: `CI / Node 20`, `CI / Node 22`
  - Go: `CI / Go 1.22`, `CI / Go stable`, `CI / govulncheck`
- Require branches to be up to date before merging
- Do not allow force pushes
- Do not allow deletions

## TypeScript: switch default branch to `main`

```bash
git checkout main
git push -u origin main
```

On GitHub: **Settings → Branches → Default branch → `main`**.

If `develop` was the old default, delete or keep it after migration.

## Go: first push to `main`

```bash
git checkout main
git remote add origin https://github.com/VZaps/vzaps-sdk-go.git
git push -u origin main
```

Create the remote repository first if it does not exist.

## Secrets

### TypeScript release

Add repository secret `NPM_TOKEN` with an npm automation token scoped to publish `@vzaps/sdk`.

Optional later: migrate to [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers) (OIDC) and remove the token secret.

## Automated setup (GitHub CLI)

Install [GitHub CLI](https://cli.github.com/) and run from the repository root:

```bash
gh api repos/{owner}/{repo}/branches/main/protection \
  --method PUT \
  --field required_status_checks[strict]=true \
  --field required_status_checks[contexts][]='CI / Node 20' \
  --field required_status_checks[contexts][]='CI / Node 22' \
  --field enforce_admins=true \
  --field required_pull_request_reviews[required_approving_review_count]=1 \
  --field restrictions=null
```

Adjust `contexts` to match the exact job names shown in the Actions tab after the first green run.

For Go, use:

```bash
gh api repos/{owner}/{repo}/branches/main/protection \
  --method PUT \
  --field required_status_checks[strict]=true \
  --field required_status_checks[contexts][]='CI / Go 1.22' \
  --field required_status_checks[contexts][]='CI / Go stable' \
  --field required_status_checks[contexts][]='CI / govulncheck' \
  --field enforce_admins=true \
  --field required_pull_request_reviews[required_approving_review_count]=1 \
  --field restrictions=null
```
