// Find the correct word by incrementing letters in alphabet

// Write a function that takes a string
// Replace every character with the next character in the alphabet

function myFunction(str) {
  return str
    .split("")
    .map((char, i) => {
      if (char === "z") return "a";

      return String.fromCharCode(char.charCodeAt(0) + 1);
    })
    .join("");
}

console.log(myFunction("abc")); // 'bcd'
console.log(myFunction("xyz")); // 'yza'
console.log(myFunction("hello")); // 'ifmmp'
