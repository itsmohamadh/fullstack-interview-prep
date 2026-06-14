## [Async](file://Users/mhaqnegahdar/Downloads/W3Schools-main/js/js_callback.html)

## [Arrays](file://Users/mhaqnegahdar/Downloads/W3Schools-main/js/js_arrays.html)

## [Objects](file://Users/mhaqnegahdar/Downloads/W3Schools-main/js/js_object_definition.html)

## [Hoisting](file://Users/mhaqnegahdar/Downloads/W3Schools-main/js/js_hoisting.html)

## [Type Conversion](/Users/mhaqnegahdar/Downloads/W3Schools-main/js/js_type_conversion.html)

## [This](/Users/mhaqnegahdar/Downloads/W3Schools-main/js/js_this.html)

## [Arrow Function](file://Users/mhaqnegahdar/Downloads/W3Schools-main/js/js_arrow_function.html)

## [Lexical This](/Users/mhaqnegahdar/Desktop/Interview Prep/02 - TypeScript - Udemi/02 - Intermediate/001 Lexical this.mp4)


That's actually a great way to study JavaScript. Don't memorize every method individually—memorize the **methods people commonly confuse**.

# String Methods

```text
slice(start, end)
→ supports negative indexes

substring(start, end)
→ negative indexes become 0

substr(start, length)
→ 2nd argument is LENGTH
→ legacy/deprecated
```

```text
replace()
→ first match only

replaceAll()
→ all matches
```

```text
toUpperCase()
toLowerCase()
→ return new string
→ do NOT modify original
```

```text
Strings are IMMUTABLE
→ methods return new strings
→ original string never changes
```

---

# String Search Methods

```text
indexOf()
→ first match

lastIndexOf()
→ last match
```

```text
includes()
→ returns true/false

indexOf()
→ returns position or -1
```

```text
search()
→ supports regex

indexOf()
→ string search only
```

```text
match()
→ returns matched values

includes()
→ returns boolean
```

---

# Array Methods

## Mutates vs Doesn't Mutate

```text
MUTATES ORIGINAL ARRAY

push()
pop()

shift()
unshift()

splice()

sort()
reverse()

fill()
```

```text
DOES NOT MUTATE

slice()

map()
filter()
reduce()

find()
findIndex()

concat()

toSorted()
toReversed()
```

---

## slice vs splice

```text
slice(start, end)
→ copies
→ does NOT modify array

splice(start, deleteCount)
→ removes/adds
→ modifies original array
```

Memory trick:

```text
slice = copy

splice = surgery
```

---

## find vs filter

```text
find()
→ first matching item

filter()
→ ALL matching items
```

---

## findIndex vs indexOf

```text
indexOf()
→ exact value

findIndex()
→ callback condition
```

```js
arr.indexOf(5)

arr.findIndex(x => x > 5)
```

---

## some vs every

```text
some()
→ at least one passes

every()
→ all must pass
```

Memory trick:

```text
some = ONE

every = ALL
```

---

## map vs forEach

```text
map()
→ returns new array

forEach()
→ returns undefined
```

Memory trick:

```text
map = transform

forEach = do something
```

---

## push/pop vs shift/unshift

```text
push()
pop()
→ END of array

shift()
unshift()
→ START of array
```

Memory trick:

```text
P = Push/Pop = back

S = Shift = start
```

---

## sort()

```text
sort()
→ converts values to strings by default
```

```js
[1, 10, 2].sort()
// [1, 10, 2]
```

Use:

```js
arr.sort((a, b) => a - b)
```

---

## includes vs some

```text
includes()
→ exact value

some()
→ condition
```

```js
arr.includes(5)

arr.some(x => x > 5)
```

---

# Objects

```text
Object.keys()
→ keys

Object.values()
→ values

Object.entries()
→ [key, value]
```

Memory trick:

```text
keys → keys

values → values

entries → both
```

---

# Equality

```text
==

→ coercion
→ converts types
```

```text
===

→ strict equality
→ compare value + type
```

Memory trick:

```text
=== ALWAYS

== ALMOST NEVER
```

---

# Null / Undefined

```text
undefined
→ variable exists
→ no value assigned
```

```text
null
→ intentional empty value
```

Memory trick:

```text
undefined = JS did it

null = you did it
```

---

# Modern Array Methods

```text
sort()
reverse()

→ mutate original
```

```text
toSorted()
toReversed()

→ return new array
```

Memory trick:

```text
toSomething()

usually = immutable version
```

---

# Most Common Interview Confusion List

```text
slice vs splice

map vs forEach

find vs filter

some vs every

replace vs replaceAll

indexOf vs includes

== vs ===

null vs undefined

push/pop vs shift/unshift

sort vs toSorted
```

# Number Methods

## Number() vs parseInt() vs parseFloat()

```text
Number()
→ converts entire value
→ fails if any invalid characters

parseInt()
→ extracts integer from start

parseFloat()
→ extracts decimal from start
```

```js
Number("123px")      // NaN
parseInt("123px")    // 123
parseFloat("123.45px") // 123.45
```

Memory trick:

```text
Number = strict

parseInt = integer parser

parseFloat = decimal parser
```

---

## isNaN() vs Number.isNaN()

```text
isNaN()
→ coerces value first

Number.isNaN()
→ strict check
```

```js
isNaN("hello")          // true
Number.isNaN("hello")   // false

Number.isNaN(NaN)       // true
```

Memory trick:

```text
Number.isNaN()

almost always preferred
```

---

## Number() vs String()

```text
Number()
→ convert to number

String()
→ convert to string
```

---

## toFixed() vs toPrecision()

```text
toFixed(n)
→ fixed decimal places

toPrecision(n)
→ total significant digits
```

```js
(123.456).toFixed(2)      // "123.46"

(123.456).toPrecision(4)  // "123.5"
```

Memory trick:

```text
Fixed = decimals

Precision = total digits
```

---

## Math.floor() vs Math.ceil() vs Math.round()

```text
Math.floor()
→ round down

Math.ceil()
→ round up

Math.round()
→ nearest integer
```

```js
Math.floor(4.9) // 4
Math.ceil(4.1)  // 5
Math.round(4.5) // 5
```

Memory trick:

```text
floor = down

ceiling = up

round = nearest
```

---

## Math.trunc() vs Math.floor()

```text
Math.trunc()
→ remove decimal

Math.floor()
→ round down
```

```js
Math.trunc(-4.9) // -4
Math.floor(-4.9) // -5
```

Memory trick:

```text
trunc = chop

floor = down
```

---

## Math.max() vs Math.min()

```text
Math.max()
→ largest value

Math.min()
→ smallest value
```

---

## Math.random()

```text
Math.random()
→ random number between 0 and 1

0 <= x < 1
```

Common interview pattern:

```js
Math.floor(Math.random() * 10)
```

```text
0 - 9
```

---

# Date Methods

## getDate() vs getDay()

```text
getDate()
→ day of month

getDay()
→ day of week
```

```js
date.getDate() // 15

date.getDay()  // 0-6
```

Memory trick:

```text
Date = month calendar number

Day = weekday
```

---

## getMonth()

```text
getMonth()
→ 0-11
```

```js
January = 0
December = 11
```

Memory trick:

```text
Months are ZERO indexed
```

⚠️ One of the most common Date mistakes.

---

## getFullYear() vs getYear()

```text
getFullYear()
→ use this

getYear()
→ legacy
```

```js
date.getFullYear() // 2026
```

Memory trick:

```text
Always use getFullYear()
```

---

## getTime()

```text
getTime()
→ milliseconds since Jan 1, 1970
```

Useful for:

```text
timestamps

date comparison

performance timing
```

---

## Date.now() vs new Date()

```text
Date.now()
→ timestamp number

new Date()
→ Date object
```

```js
Date.now()

new Date()
```

Memory trick:

```text
now() = number

new Date() = object
```

---

## Date.parse() vs new Date()

```text
Date.parse()
→ timestamp

new Date()
→ Date object
```

```js
Date.parse("2026-06-13")

new Date("2026-06-13")
```

---

## UTC vs Local Time

```text
getHours()
→ local timezone

getUTCHours()
→ UTC timezone
```

Same pattern for:

```text
getMonth()

getDate()

getFullYear()

etc.
```

Memory trick:

```text
getX()

local time

getUTCX()

UTC time
```

---

# Most Common Number & Date Interview Confusions

```text
Number vs parseInt vs parseFloat

isNaN vs Number.isNaN

toFixed vs toPrecision

floor vs ceil vs round

floor vs trunc

getDate vs getDay

getMonth (0-indexed)

Date.now vs new Date

Date.parse vs new Date

local vs UTC methods
```

These are the Number/Date APIs that are most frequently mixed up in interviews and day-to-day JavaScript work. The biggest gotchas are:

```text
getMonth() starts at 0

getDay() is weekday, not month day

parseInt() != Number()

floor() != trunc() for negatives

Date.now() returns a number, not a Date
```
