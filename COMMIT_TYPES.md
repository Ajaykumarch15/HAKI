# Commit Types Reference

This project uses [Conventional Commits](https://www.conventionalcommits.org/). Every commit message must follow this format:

```
type(scope): description
```

## Types

| Type | When to Use | Version Bump | Example |
|------|-------------|--------------|---------|
| `feat` | A new feature | **Minor** (1.x.0) | `feat: add dark mode toggle` |
| `fix` | A bug fix | **Patch** (x.1.0) | `fix: resolve note save race condition` |
| `docs` | Documentation only | None | `docs: update README setup instructions` |
| `style` | Code style (formatting, semicolons, etc.) | None | `style: fix indentation in Sidebar` |
| `refactor` | Code change that neither fixes a bug nor adds a feature | None | `refactor: extract auth hooks into separate file` |
| `perf` | Performance improvement | **Patch** (x.1.0) | `perf: memoize note filtering` |
| `test` | Adding or updating tests | None | `test: add unit tests for deriveTags` |
| `build` | Build system or external dependencies | None | `build: upgrade Vite to v8` |
| `ci` | CI/CD configuration changes | None | `ci: add GitHub Actions release workflow` |
| `chore` | Other maintenance tasks | None | `chore: update .gitignore` |
| `revert` | Reverts a previous commit | None | `revert: feat: add dark mode toggle` |

## Scope (optional)

Add a scope in parentheses to specify what part of the codebase changed:

```
feat(auth): add email/password login
fix(editor): prevent duplicate auto-saves
chore(deps): bump @supabase/supabase-js to 2.116
```

Common scopes for this project:
- `auth` — authentication/login
- `editor` — TipTap editor
- `sidebar` — sidebar navigation
- `store` — Zustand store
- `ui` — UI components
- `deps` — dependency updates
- `release` — release automation

## Breaking Changes

Add `!` after the type/scope to indicate a breaking change (triggers **Major** bump):

```
feat!: redesign note data model
feat(auth)!: remove password reset flow
```

Or include a `BREAKING CHANGE:` footer:

```
feat: redesign note data model

BREAKING CHANGE: notes table schema changed, existing data migration required
```

## Examples

```bash
# Feature
git commit -m "feat: add tag color customization"

# Bug fix
git commit -m "fix: prevent trash note from appearing in all notes"

# Chores
git commit -m "chore(release): 1.2.0 [skip ci]"
git commit -m "chore: update README"
git commit -m "chore(deps): bump zustand to 5.0.15"

# Documentation
git commit -m "docs: add CONTRIBUTING guide"

# Breaking change
git commit -m "feat!: switch from localStorage to Supabase for note storage"

# With scope
git commit -m "refactor(store): simplify note creation logic"
git commit -m "fix(editor): handle empty title edge case"
git commit -m "ci: add semantic-release workflow"
```
