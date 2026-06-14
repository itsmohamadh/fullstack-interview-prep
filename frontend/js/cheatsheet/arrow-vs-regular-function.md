For interview prep, I'd focus much more on **behavior differences** than syntax differences.

# Regular Function vs Arrow Function

```text
Regular Function

this = determined by HOW function is called

Arrow Function

this = determined by WHERE function is defined
```

Memory trick:

```text
Regular → dynamic this

Arrow → lexical this
```

---

# this

```js
const person = {
  name: 'John',

  regular: function() {
    console.log(this.name);
  },

  arrow: () => {
    console.log(this.name);
  }
};

person.regular(); // John
person.arrow();   // undefined
```

Memory trick:

```text
Regular

this = caller

Arrow

this = parent scope
```

---

# Methods

Use regular functions for object methods.

```js
const user = {
  name: 'John',

  greet() {
    return this.name;
  }
};
```

Avoid:

```js
const user = {
  name: 'John',

  greet: () => this.name
};
```

Memory trick:

```text
Object methods

→ Regular function
```

---

# Event Listeners

```js
button.addEventListener('click', function () {
  console.log(this);
});
```

```text
this = button
```

---

```js
button.addEventListener('click', () => {
  console.log(this);
});
```

```text
this = outer scope
```

Memory trick:

```text
Need clicked element?

Use regular function
```

---

# Constructors

Regular:

```js
function Person(name) {
  this.name = name;
}

new Person('John');
```

Arrow:

```js
const Person = (name) => {
  this.name = name;
};

new Person('John'); // Error
```

Memory trick:

```text
Arrow functions

cannot be constructors
```

---

# arguments Object

Regular:

```js
function test() {
  console.log(arguments);
}
```

Arrow:

```js
const test = () => {
  console.log(arguments);
};
```

```text
Error / inherited from outer scope
```

Memory trick:

```text
Regular

has arguments

Arrow

no arguments
```

Use:

```js
(...args) => args
```

---

# Implicit Return

Regular:

```js
function add(a, b) {
  return a + b;
}
```

Arrow:

```js
const add = (a, b) => a + b;
```

Memory trick:

```text
One expression

Arrow returns automatically
```

---

# Returning Objects

Common mistake:

```js
const fn = () => { name: 'John' };
```

Returns:

```js
undefined
```

Correct:

```js
const fn = () => ({ name: 'John' });
```

Memory trick:

```text
Arrow + object

wrap object in ()
```

---

# Hoisting

Function declaration:

```js
sayHello();

function sayHello() {}
```

Works.

Arrow:

```js
sayHello();

const sayHello = () => {};
```

Error.

Memory trick:

```text
Function declarations

hoisted

Arrow functions

not hoisted
```

---

# Best Use Cases

```text
Regular Functions

✓ Object methods

✓ Constructors

✓ Event handlers needing this

✓ When you need arguments
```

```text
Arrow Functions

✓ Array methods

✓ Callbacks

✓ React components

✓ Short utility functions

✓ When you want parent this
```

---

# Interview Cheat Sheet

```text
Regular Function

dynamic this

has arguments

can use new

good for methods

function declarations hoisted
```

```text
Arrow Function

lexical this

no arguments

cannot use new

great for callbacks

not hoisted (when assigned to const/let)
```

# One-Line Memory Trick

```text
Need your own this?

→ Regular function

Need parent's this?

→ Arrow function
```

That's the single most important rule that explains about 90% of the "when should I use an arrow function?" interview questions.
