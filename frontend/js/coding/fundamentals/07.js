// Remove last n characters of string

// Write a function that takes a string and a number
// Remove the last n characters
// Return the result

function myFunction(str, n) {
  return str
    .split("")
    .splice(0, str.length - n)
    .join("");
}

console.log(myFunction("abcdef", 2)); // 'abcd'
console.log(myFunction("hello world", 5)); // 'hello '
console.log(myFunction("javascript", 6)); // 'java'
