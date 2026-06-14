Here’s a cheat sheet of **time complexity (Big-O)** for major JavaScript methods, assuming typical engine implementations (e.g., V8).

---

## ✅ **Array Methods**

| Method | Time Complexity | Notes |
|--------|----------------|-------|
| `push()` | **O(1)** | Amortized (occasional resize) |
| `pop()` | **O(1)** | |
| `shift()` | **O(n)** | Reindexes all elements |
| `unshift()` | **O(n)** | Reindexes all elements |
| `concat()` | **O(n)** | n = sum of lengths |
| `slice()` | **O(k)** | k = end - start; shallow copy |
| `splice(start, deleteCount)` | **O(n)** | Worse for shifting elements |
| `indexOf()` / `lastIndexOf()` | **O(n)** | |
| `includes()` | **O(n)** | |
| `reverse()` | **O(n)** | |
| `sort()` | **O(n log n)** | Timsort (V8, Chrome) |
| `map()` / `filter()` / `forEach()` / `reduce()` | **O(n)** | Single pass |
| `find()` / `findIndex()` | **O(n)** | Short-circuits |
| `some()` / `every()` | **O(n)** | Short-circuits |
| `flat()` / `flatMap()` | **O(n)** | n = total elements |

---

## ✅ **Object Methods**

| Operation | Time Complexity |
|-----------|----------------|
| Property access (`obj.key`) | **O(1)** average |
| Property assignment (`obj.key = x`) | **O(1)** average |
| `delete obj.key` | **O(1)** average |
| `hasOwnProperty()` | **O(1)** average |
| `Object.keys()` / `values()` / `entries()` | **O(n)** |
| `Object.assign()` | **O(n)** |

---

## ✅ **Set / Map Methods**

| Method | Time Complexity |
|--------|----------------|
| `add()` / `set()` | **O(1)** average |
| `delete()` / `has()` / `get()` | **O(1)** average |
| `clear()` | **O(1)** |
| `size` property | **O(1)** |
| Iteration (`forEach`, `for...of`) | **O(n)** |

---

## ✅ **String Methods**

| Method | Notes |
|--------|-------|
| `charAt()`, `length` | **O(1)** |
| `slice()` / `substring()` | **O(k)** where k = result length |
| `indexOf()` / `includes()` | **O(n)** |
| `split()` | **O(n)** |
| `replace()` (string pattern) | **O(n)** |
| `replace()` (regex) | engine dependent, often **O(n)** |
| `toUpperCase()` / `toLowerCase()` | **O(n)** |
| `trim()` | **O(n)** |

---

## ✅ **Spread / Rest / Destructuring**

| Operation | Time Complexity |
|-----------|----------------|
| `[...arr]` | **O(n)** |
| `{...obj}` | **O(n)** |
| Array destructuring | **O(n)** in worst case (iterates) |
| Object destructuring | **O(keys)** |

---

## ⚠️ Gotchas (Watch Out!)

- **`shift()` / `unshift()`** – avoid in loops over large arrays.
- **`sort()`** — modifies original array, not stable before ES2019 (now stable in V8).
- Nested loops over arrays = **O(n²)** or worse.
- `delete` on objects doesn’t free memory instantly; also makes property access slower in some engines.
- Spread on large array inside a loop = quadratic.

---

## 🧠 Memory Complexity

- Most array/object copies are **O(n)** memory.
- Recursive operations may add **O(n)** call stack space unless optimized.
- loop+ include -> O(n²)
- Shrinking inner loop is still -> O(n²)
- Halving/doubling -> O(㏒ n)
- Loop + hashmap -> O(n)

