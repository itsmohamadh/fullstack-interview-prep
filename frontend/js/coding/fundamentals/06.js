// Extract first half of string

// Write a function that takes a string
// Return the first half of the string

function myFunction(str) {
  return str
    .split("")
    .splice(0, str.length / 2)
    .join("");
}

console.log(myFunction("abcdefgh")); // 'abcd'
console.log(myFunction("123456")); // '123'
console.log(myFunction("javascript")); // 'javas'
