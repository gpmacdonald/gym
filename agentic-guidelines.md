# Agentic Guidelines for Claude Code
## Personal Fitness Tracker PWA Project

**Version:** 1.0  
**Date:** December 18, 2025  
**Purpose:** Guidelines for Claude Code to work effectively across multiple sessions on this project

---

## 1. Overview

This document provides guidelines for Claude Code to work effectively on the Personal Fitness Tracker PWA project across multiple coding sessions. These guidelines are based on Anthropic's research on effective harnesses for long-running agents.

### 1.1 Core Principles

1. **Incremental Progress**: Work on one task at a time, verify completion, then pause for human approval
2. **Clean State**: Always leave the codebase in a working, committable state
3. **Clear Documentation**: Document progress and decisions for future sessions
4. **Test-Driven**: Verify each task with appropriate tests before marking complete

### 1.2 Human-in-the-Loop Workflow

**CRITICAL**: After completing each significant task:
1. Run all relevant tests
2. Commit changes with a descriptive message
3. Update the progress file
4. **PAUSE and ask the human** whether to proceed to the next task
5. Wait for explicit approval before continuing

---

## 2. Project Structure

### 2.1 Required Files

The following files must be maintained throughout the project:

```
fitness-tracker/
├── claude-progress.txt      # Progress log (ALWAYS update after each task)
├── TASK-CHECKLIST.md        # Master task list with completion status
├── README.md                # Project documentation
├── init.sh                  # Script to start development environment
├── src/                     # Application source code
├── tests/                   # Test files
└── docs/                    # Additional documentation
```

### 2.2 Progress File (claude-progress.txt)

This file is **critical** for maintaining context across sessions. Update it after every task.

**Format:**
```
================================================================================
CLAUDE PROGRESS LOG - Personal Fitness Tracker PWA
================================================================================

CURRENT STATUS: [In Progress / Paused / Blocked]
LAST UPDATED: [Date and Time]
CURRENT TASK: [Task number and name]
NEXT TASK: [Task number and name]

--------------------------------------------------------------------------------
SESSION LOG
--------------------------------------------------------------------------------

## Session [N] - [Date]

### Completed
- [Task X]: [Brief description of what was done]
  - Files modified: [list of files]
  - Tests added: [list of test files]
  - Commit: [commit hash or message]

### Notes
- [Any important decisions, blockers, or observations]

### For Next Session
- [Specific guidance for picking up where left off]

--------------------------------------------------------------------------------
KNOWN ISSUES
--------------------------------------------------------------------------------
- [List any known bugs or incomplete items]

--------------------------------------------------------------------------------
ARCHITECTURE DECISIONS
--------------------------------------------------------------------------------
- [Document any significant technical decisions and reasoning]
```

### 2.3 Task Checklist (TASK-CHECKLIST.md)

Maintain a JSON-formatted section for machine-readable task status:

```json
{
  "tasks": [
    {
      "id": 1,
      "name": "Project scaffolding",
      "status": "complete",
      "tests_passing": true,
      "commit": "abc123"
    },
    {
      "id": 2,
      "name": "Database setup",
      "status": "in_progress",
      "tests_passing": false,
      "commit": null
    }
  ]
}
```

**Rules for Task Status:**
- Only change `status` field, never remove or reorder tasks
- A task is only `complete` when ALL tests pass
- Record the commit hash when marking complete

---

## 3. Session Workflow

### 3.1 Starting a New Session

Every session must begin with these steps (in order):

```bash
# 1. Verify working directory
pwd

# 2. Read progress file
cat claude-progress.txt

# 3. Read task checklist
cat TASK-CHECKLIST.md

# 4. Check git status and recent history
git status
git log --oneline -10

# 5. Run init script to start development environment
./init.sh

# 6. Run existing tests to verify codebase is healthy
npm test

# 7. If tests fail, FIX THEM FIRST before proceeding
```

### 3.2 Working on a Task

For each task:

1. **Announce the task** - State which task you're working on
2. **Write tests first** (when applicable) - Define expected behavior
3. **Implement incrementally** - Make small, testable changes
4. **Test frequently** - Run tests after each significant change
5. **Commit working code** - Never commit broken code

### 3.3 Completing a Task

After finishing a task:

```bash
# 1. Run all tests
npm test

# 2. Run linting
npm run lint

# 3. If everything passes, commit
git add .
git commit -m "Task [N]: [Description]

- [Bullet point of what was done]
- [Another bullet point]

Tests: [list of test files added/modified]"

# 4. Update claude-progress.txt
# 5. Update TASK-CHECKLIST.md (mark task as complete)

# 6. PAUSE AND ASK HUMAN FOR APPROVAL
```

**Example completion message:**
```
✅ Task 5 Complete: Database Setup with Dexie.js

Summary:
- Created src/lib/db.ts with Dexie database configuration
- Defined tables: exercises, workouts, workoutSets, cardioSessions, settings
- Added indexes for efficient queries
- Created src/lib/queries.ts with CRUD operations

Tests Added:
- tests/lib/db.test.ts (8 tests, all passing)
- tests/lib/queries.test.ts (12 tests, all passing)

Commit: [hash]

📋 Next Task: Task 6 - Pre-populate exercise library

Shall I proceed with Task 6?
```

### 3.4 Ending a Session

If the session ends (context limit, user request, or natural stopping point):

1. Ensure current work is committed (even if task incomplete)
2. Update `claude-progress.txt` with detailed notes
3. Document any in-progress work in "For Next Session" section
4. List any known issues or blockers

---

## 4. Code Quality Standards

### 4.1 Commit Messages

Use conventional commit format:
```
type(scope): description

- Detail 1
- Detail 2

Tests: test-file.test.ts
```

**Types:** feat, fix, test, docs, refactor, style, chore

### 4.2 Testing Requirements

| Task Type | Required Tests |
|-----------|----------------|
| Database/queries | Unit tests with Vitest |
| React components | Component tests with React Testing Library |
| Utility functions | Unit tests with Vitest |
| User flows | Integration tests |
| PWA features | E2E tests with Playwright |

**Minimum coverage targets:**
- Database operations: 90%
- Utility functions: 90%
- React components: 80%
- Overall: 70%

### 4.3 Code Style

- Use TypeScript strict mode
- Follow ESLint configuration
- Use Prettier for formatting
- Prefer functional components with hooks
- Keep components small and focused

---

## 5. Error Handling

### 5.1 When Tests Fail

1. **DO NOT** proceed to next task
2. **DO NOT** mark task as complete
3. Investigate and fix the issue
4. If stuck, document the problem and ask for help

### 5.2 When Blocked

If unable to proceed:

1. Document the blocker in `claude-progress.txt`
2. List what was attempted
3. Propose potential solutions
4. Ask the human for guidance

### 5.3 When Finding Bugs in Previous Work

1. Stop current task
2. Document the bug
3. Ask human: "Found bug in [area]. Should I fix it now or continue with current task?"
4. Wait for guidance

---

## 6. File Management

### 6.1 Creating New Files

- Follow the established project structure
- Add appropriate TypeScript types
- Include JSDoc comments for exported functions
- Create corresponding test file

### 6.2 Modifying Existing Files

- Make minimal, focused changes
- Don't refactor unrelated code
- Preserve existing functionality
- Update tests if behavior changes

### 6.3 Deleting Files

- Requires human approval
- Update imports in affected files
- Remove or update related tests
- Document in commit message

---

## 7. Communication Guidelines

### 7.1 Status Updates

Provide clear status updates:

```
🔄 Working on: Task 7 - Exercise selector component
📁 Current file: src/components/workout/ExerciseSelector.tsx
⏱️ Progress: Implementing search/filter functionality
```

### 7.2 Asking for Approval

Always be explicit when pausing:

```
⏸️ PAUSED - Awaiting Approval

Task 7 is complete. Summary:
- [What was done]
- [Test results]
- [Any notes]

Options:
1. Proceed to Task 8: [Task name]
2. Review the code first
3. Make modifications to Task 7

What would you like to do?
```

### 7.3 Asking Questions

When uncertain, ask clearly:

```
❓ Question about Task 8

The PRD specifies [X], but I'm unsure about [Y].

Options I see:
A) [Option A with tradeoffs]
B) [Option B with tradeoffs]

Which approach do you prefer?
```

---

## 8. Init Script (init.sh)

The init.sh script should handle environment setup:

```bash
#!/bin/bash

echo "🏋️ Starting Fitness Tracker Development Environment"

# Check Node.js version
node_version=$(node -v 2>/dev/null)
if [ -z "$node_version" ]; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi
echo "✅ Node.js: $node_version"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start development server
echo "🚀 Starting development server..."
npm run dev &
DEV_PID=$!

# Wait for server to be ready
echo "⏳ Waiting for server..."
sleep 3

echo ""
echo "✅ Development environment ready!"
echo "   Server: http://localhost:5173"
echo "   PID: $DEV_PID"
echo ""
echo "To stop: kill $DEV_PID"
```

---

## 9. Quick Reference

### 9.1 Session Start Checklist
- [ ] Read `claude-progress.txt`
- [ ] Read `TASK-CHECKLIST.md`
- [ ] Check `git log --oneline -10`
- [ ] Run `./init.sh`
- [ ] Run `npm test`
- [ ] Fix any failing tests before proceeding

### 9.2 Task Completion Checklist
- [ ] All new tests written and passing
- [ ] All existing tests still passing
- [ ] Code linted without errors
- [ ] Changes committed with descriptive message
- [ ] `claude-progress.txt` updated
- [ ] `TASK-CHECKLIST.md` updated
- [ ] **PAUSED for human approval**

### 9.3 Key Commands
```bash
npm run dev          # Start development server
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
npm run lint         # Check code style
npm run build        # Production build
npm run preview      # Preview production build
```

---

## 10. Failure Mode Prevention

Based on Anthropic's research, these are common agent failure modes and how to avoid them:

| Failure Mode | Prevention Strategy |
|--------------|---------------------|
| Trying to do too much at once | Work on ONE task at a time, pause after each |
| Declaring victory too early | Only mark complete when ALL tests pass |
| Leaving code in broken state | Always commit working code, run tests first |
| Losing context between sessions | Maintain detailed `claude-progress.txt` |
| Not testing end-to-end | Use Playwright for E2E tests, manual testing checklist |
| Forgetting previous decisions | Document in Architecture Decisions section |

---

**End of Agentic Guidelines**
