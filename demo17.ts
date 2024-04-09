/**
 * 协变 逆变和不变
 * 
 * 协变：子类型可以赋值给父类型
 * 逆变: 主要是函数赋值的时候函数参数的性质，参数的父类型可以赋值给子类型
 * 逆变和协变都是型变，是针对父子类型而言的，非父子类型自然就不会型变，也就是不变
 * 不变：只有相同类型可以赋值
 */

// 1. 协变

// tips: ts中父子类型的定义，是通过结构判断的， 更具体的那个是子类型。


interface Human {
  name: string;
  age: number;
}

interface Student {
  name: string;
  age: number;
  hobbies: string[]
}

let person01: Human = {
  name: 'xiaoming',
  age: 18
}

let student01: Student = {
  name: 'xiaohong',
  age: 20,
  hobbies: ['football', 'basketball']
}

person01 = student01; // ok

// 2. 逆变
let printName: (human: Human) => void

printName = (human) => {
  console.log(human.name)
}

let printHobbies: (student: Student) => void

printHobbies = (student) => {
  console.log(student.hobbies)
}

// 因为这个printHobbies函数调用的时候是按照 Student 来约束的类型，但实际上函数只用到了父类型 Human 的属性和方法，当然不会有问题，依然是类型安全的。

printHobbies = printName; // ok

printName = printHobbies; // error

// tips: 关闭strictFunctionTypes选项或者ts版本在 ts2.x 之前，父类型可以赋值给子类型，子类型可以赋值给父类型，既逆变又协变，叫做“双向协变”。
// strictFunctionTypes参数开启以后函数参数就只支持逆变，否则支持双向协变。

type Func = (a: string) => void;

const func1701: Func = (a: 'hello') => undefined

// 这里的参数hello不是string的父类型，不满足逆变的条件，所以这里会报错。
// 这里的返回值undefined是void的子类型，满足协变的条件，所以这里不会报错。

type isParent01 = undefined extends void ? true : false; // true
type isParent02 = unknown extends any ? true : false; // true

// 3. 不变