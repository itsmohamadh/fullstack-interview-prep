// Check if two dates are within 1 hour from each other

// Write a function that takes two dates
// Return true if the difference is less than or equal to 1 hour

function myFunction(date1, date2) {
  
}

console.log(
  myFunction(
    new Date('2025-01-01T10:00:00'),
    new Date('2025-01-01T10:30:00')
  )
); // true

console.log(
  myFunction(
    new Date('2025-01-01T10:00:00'),
    new Date('2025-01-01T12:00:00')
  )
); // false