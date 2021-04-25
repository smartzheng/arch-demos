function Person(name) {
  this.name = name
  return {1: 1}
}
const person = new Person('lucas')
console.log(person)
// {1: 1}
