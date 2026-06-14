
## [Live Coding Interview Flow](https://www.youtube.com/watch?v=lyzYrW_FxCM)

### Step 1: Understand + scope

Restate the problem and ignore non-core edge cases.

### Step 2: Wireframe

Quick sketch of UI and components, focus only on interactive parts.

### Step 3: Identify dynamics

Mark what changes with input vs what stays static.

### Step 4: State design

Decide state shape and where it lives. Lift state if siblings need it.

### Step 5: Separate derived state

Only store raw state, compute everything else from it.

### Step 6: Plan updates

Define how user actions mutate state, keep handlers simple.

### Step 7: Brute force build

Single component, hardcode if needed, make it work first.

### Step 8: Add logic

Layer parsing and computation step by step, debug as you go.

### Step 9: Verify

Use debugger or logs to confirm state and UI behavior.

### Step 10: Edge cases + talk

After working version, mention recursion, cycles, invalid input, scaling.
