// Return the next higher prime number

// Write a function that takes a number
// Return the next prime number greater than the given number

function myFunction(num) {
  function isPrime(n) {
    if (n < 2) return false;

    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i===0) return false;
    }

    return true;
  }

  let next = num + 1;

  while (!isPrime(next)) {
    next++;
  }

  return next;
}

console.log(myFunction(2)); // 3
console.log(myFunction(7)); // 11
console.log(myFunction(14)); // 17
