// Check if two dates fall on the exact same day

// Write a function that takes two dates
// Return true if they have the same year, month, and day

function myFunction(date1, date2) {
  
}

console.log(
  myFunction(
    new Date('2025-01-01T10:00:00'),
    new Date('2025-01-01T22:00:00')
  )
); // true

console.log(
  myFunction(
    new Date('2025-01-01'),
    new Date('2025-01-02')
  )
); // false