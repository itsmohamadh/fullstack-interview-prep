const object = {
  who: `World`,

  greet() {
    return `Hello, ${this.who}`;
  },
  farewell: () => {
    return `Goodbye ${this.who}`;
  },
};

console.log(object.greet()); // Output: Hello World
console.log(object.farewell.bind(object)); // Output: Goodbye undefined
