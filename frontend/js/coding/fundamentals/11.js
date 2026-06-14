// How many times does a character occur?

// Write a function that takes a string and a character
// Return how many times the character appears in the string

function myFunction(str, char) {
  return str.split(char).length - 1;
}

console.log(myFunction("hello", "l")); // 2
console.log(myFunction("banana", "a")); // 3
console.log(myFunction("javascript", "j")); // 1
