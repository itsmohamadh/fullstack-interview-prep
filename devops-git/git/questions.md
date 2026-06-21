# Git Interview Preparation (80/20)

---

# Core Concepts

### Q1: What is Git and how does it work?

**Answer:**

Git is a distributed version control system that tracks changes to files over time. Every developer has a complete copy of the repository, including the full history.

Git stores snapshots of your project, allowing you to:

- Track changes
- Collaborate with multiple developers
- Create isolated branches for features
- Merge changes safely
- Revert to previous versions

The three main areas in Git are:

```
Working Directory
       |
       | git add
       ↓
Staging Area (Index)
       |
       | git commit
       ↓
Repository (History)
```

---

# Daily Workflow

### Q2: Explain your typical Git workflow in a team.

**Answer:**

A typical feature workflow:

1. Pull the latest changes from the main branch

```bash
git checkout main
git pull origin main
```

2. Create a feature branch

```bash
git checkout -b feature/user-authentication
```

3. Make changes and commit regularly

```bash
git add .
git commit -m "Add JWT authentication middleware"
```

4. Push the branch

```bash
git push origin feature/user-authentication
```

5. Open a Pull Request for review.

After approval, the branch is merged into `main`.

---

# Branching

### Q3: Why do we use branches?

**Answer:**

Branches allow developers to work on isolated changes without affecting the stable codebase.

Common branches:

- `main` or `master`: Production-ready code
- `develop`: Integration branch (some teams)
- `feature/*`: New features
- `bugfix/*`: Fixes
- `hotfix/*`: Urgent production fixes

Benefits:

- Parallel development
- Easier code reviews
- Safer experimentation
- Cleaner release process

---

### Q4: What is the difference between `git merge` and `git rebase`?

**Answer:**

### Merge

Combines two branches and creates a merge commit.

```
main:
A---B---C
         \
feature:  D---E

After merge:

A---B---C------M
         \     /
          D---E
```

Pros:

- Preserves exact history
- Safer for shared branches

Cons:

- Creates extra merge commits

---

### Rebase

Moves your commits on top of another branch.

```
Before:

main:
A---B---C

feature:
A---B---D---E


After rebase:

main:
A---B---C

feature:
        C---D'---E'
```

Pros:

- Cleaner linear history
- Easier to read commit logs

Cons:

- Rewrites history, so avoid rebasing branches already shared with others.

**Rule of thumb:**

- Rebase your local feature branch before opening a PR.
- Merge shared branches.

---

# Pulling Changes

### Q5: What is the difference between `git pull` and `git fetch`?

**Answer:**

### `git fetch`

Downloads the latest changes from the remote repository but does not modify your local branches.

```bash
git fetch origin
```

You can inspect changes before integrating them.

---

### `git pull`

Fetches changes and automatically merges them into your current branch.

```bash
git pull origin main
```

Equivalent to:

```bash
git fetch
git merge
```

Use `fetch` when you want more control.

---

# Merge Conflicts

### Q6: What is a merge conflict and how do you resolve it?

**Answer:**

A merge conflict happens when Git cannot automatically decide which changes to keep.

Example:

```javascript
<<<<<<< HEAD
const timeout = 5000;
=======
const timeout = 3000;
>>>>>>> feature/performance
```

Resolution process:

1. Open the conflicted file.
2. Decide what the final code should be.
3. Remove the conflict markers.
4. Stage the resolved file.

```bash
git add config.js
```

5. Continue the merge/rebase.

```bash
git commit
```

or

```bash
git rebase --continue
```

---

# Undoing Changes

### Q7: ⭐️ [Difference between `git reset`, `git revert`, and `git checkout/restore`?](https://www.youtube.com/watch?v=QXp2PnK2lw8&list=PL4cUxeGkcC9j2pbmcA93DR1A3m7VEgSxK&index=8&pp=iAQB)

**Answer:**

## `git restore`

Restores files to a previous state without changing commit history.

```bash
git restore app.js
```

---

## `git reset`

Moves the current branch pointer backwards.

Soft reset:

- Keeps changes staged

```bash
git reset --soft HEAD~1
```

Mixed reset (default):

- Keeps changes but unstages them

```bash
git reset HEAD~1
```

Hard reset:

- Deletes commits and local changes

```bash
git reset --hard HEAD~1
```

Use carefully because it can permanently remove work.

---

## `git revert`

Creates a new commit that undoes a previous commit.

```bash
git revert abc123
```

Best for undoing changes already pushed to a shared branch.

---

# Stashing

### Q8: What is Git stash and when would you use it?

**Answer:**

Stash temporarily saves uncommitted changes so you can switch branches.

Example:

```bash
git stash
```

Switch branches:

```bash
git checkout main
```

Return your changes:

```bash
git stash pop
```

Common use case:

You are working on a feature and need to quickly switch branches to fix a production bug without committing unfinished work.

---

# Inspecting History

### Q9: How do you inspect Git history?

**Answer:**

Common commands:

View commits:

```bash
git log
```

Compact view:

```bash
git log --oneline --graph --all
```

View file changes:

```bash
git diff
```

See staged changes:

```bash
git diff --staged
```

See who changed each line:

```bash
git blame file.js
```

---

# Remote Repositories

### Q10: What is the difference between `origin` and `upstream`?

**Answer:**

`origin` is the default name for the remote repository you cloned from.

Example:

```
origin
  |
  | push/pull
  ↓
Your GitHub repository
```

`upstream` usually refers to the original repository that your fork came from.

Example:

```
upstream (original project)
          |
          |
       your fork (origin)
          |
          |
       local repository
```

Common in open-source workflows.

---

# Code Reviews & Pull Requests

### Q11: What do you look for during a Pull Request review?

**Answer:**

I look at:

- Correctness of the implementation
- Edge cases and error handling
- Readability and maintainability
- Naming and code organization
- Performance concerns
- Security issues
- Tests and documentation
- Whether the change matches the project architecture

I also provide constructive feedback and explain the reasoning behind suggestions.

---

# Advanced but Common

### Q12: A developer accidentally committed a secret API key. What should they do?

**Answer:**

If the commit has not been pushed:

Remove it from the last commit:

```bash
git reset --soft HEAD~1
```

Remove the secret and commit again.

---

If it has already been pushed:

1. Immediately rotate the secret (create a new API key).
2. Remove it from the repository history using tools like `git filter-repo` or BFG.
3. Force-push the cleaned history if the team agrees.

The most important action is rotating the secret because Git history may already have been copied by others.

---

# Senior-Level Discussion

### Q13: How do you keep Git history clean in a large team?

**Answer:**

Common practices:

- Use short-lived feature branches
- Create meaningful commits
- Require Pull Request reviews
- Rebase feature branches on top of the latest main branch before merging
- Squash small "fix typo" or "address review comment" commits
- Protect the `main` branch from direct pushes
- Use CI checks before merging

The goal is to make the history easy to understand and easy to revert when problems occur.

---

# Quick Command Cheat Sheet

```bash
# Clone repository
git clone URL

# Check status
git status

# Create branch
git checkout -b feature/x

# Switch branch
git checkout main

# Stage files
git add .

# Commit
git commit -m "message"

# Push
git push origin branch-name

# Pull latest changes
git pull origin main

# Fetch changes
git fetch

# See history
git log --oneline --graph

# Compare changes
git diff

# Temporarily save work
git stash
git stash pop

# Undo last commit but keep changes
git reset HEAD~1

# Undo a pushed commit safely
git revert commit-hash
```

---

# Most Likely Interview Topics (Know These Very Well)

1. Git workflow with feature branches and PRs
2. Merge vs rebase
3. Pull vs fetch
4. Resolving merge conflicts
5. Reset vs revert
6. Staging area and commit lifecycle
7. Stashing
8. Reading history with log and diff
9. How you collaborate during code reviews
10. Keeping history clean in a team

For a mid-level to senior frontend/full-stack role, these topics cover the vast majority of Git questions.
