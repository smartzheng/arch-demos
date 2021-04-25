Function.prototype.call = function (context, ...args) {
  if (typeof this !== 'function') {
    throw new TypeError('type error')
  }
  context = context || window
  let fnSymbol = Symbol('fn')
  context[fnSymbol] = this
  context[fnSymbol](...args)
  delete context[fnSymbol]
}

function foo(age, year) {
  console.log(this.name, age, year)
}

const obj1 = { name: 1 }
foo.call(obj1, 18, 2000)


Function.prototype.apply = function (context, args) {
  if (typeof this !== 'function') {
    throw new Error('type error')
  }
  context = context || window
  const fnSymbol = Symbol('fn')
  context[fnSymbol] = this
  context[fnSymbol](...args)
  delete context[fnSymbol]
}

const obj2 = { name: 1 }
foo.apply(obj2, [18, 2000])


Function.prototype.bind = function (context, ...args) {
  if (typeof this !== 'function') {
    throw new Error('type error')
  }
  context = context || window
  const fnSymbol = Symbol('fn')
  context[fnSymbol] = this
  return function (...args1) {
    context[fnSymbol](...args, ...args1)
    delete context[fnSymbol]
  }
}

const obj3 = { name: 1 }
foo.bind(obj3, 18)(2000)
