## 什么是类型？
> 是编程语言提供的一种抽象概念，用来帮助我们更好的理解和使用数据
> 不同类型变量占据的内存空间不同，不同类型变量的取值范围不同，不同类型变量的操作不同
> 比如boolean类型会分配4个字节的内存空间，取值范围是true和false，操作是逻辑运算
> 比如number类型会分配8个字节的内存空间，取值范围是-2^53到2^53，操作是数学运算

## 什么是类型安全？
> 保证对某种类型只做该类型允许的操作， 类型检查就是为了保证类型安全。

## 怎么保证类型安全？
> 类型检查。分为动态类型检查和静态类型检查。Typescript是静态类型检查，即在编译阶段就检查类型。

动态类型只适合简单的场景，对于大项目却不太合适，因为代码中可能藏着的隐患太多了，万一线上报一个类型不匹配的错误，那可能就是大问题。

而静态类型虽然会增加写代码的成本，但是却能更好的保证代码的健壮性，减少 Bug 率。

所以，大型项目注定会用静态类型语言开发。

## 对于支持类型系统的语言，共分为三种类型系统：
1. 简单类型系统。能保证类型安全，但有些死板。
一个 add 函数既可以做整数加法、又可以做浮点数加法，却需要声明两个函数。eg:
```java
int add(a: int, b: int) {
  return a + b;
}
double add(a: double, b: double) {
  return a + b;
}
```
2. 泛型。支持类型参数化，能够更好的复用代码，但是不够灵活。
eg:
```java
T add<T>(T a, T b) {
  return a + b;
}
```
3. 支持类型编程。对传入的类型参数（泛型）做各种逻辑运算，产生新的类型，就是类型编程。
因为js本身不同于java，必须通过new的方式声明对象，js可以通过字面量直接声明对象，所以泛型在js中就显得不够灵活。
比如，一个返回对象某个属性值的函数，这里拿到了 T，也不能拿到它的属性和属性值，因为 T 是一个类型，而不是一个对象。
```typescript
function getPropValue<T> (obj: T, key): key对应的值类型 {
  return obj[key];
}
```

typescript
```typescript
function getPropValue<T extends Object, K extends keyof T> (obj: T, key: K): T[K] {
  return obj[key];
}
```
这里keyof T、T[K]就是对类型参数T的类型运算，是类型编程的一种体现，keyof T是获取T的所有属性名，T[K]是获取T的属性K的类型。

**TypeScript 的类型系统是图灵完备的，也就是能描述各种可计算逻辑。简单点来理解就是循环、条件等各种 JS 里面有的语法它都有，JS 能写的逻辑它都能写。**
对类型编程是TypeScript类型系统最强大的部分，可以实现各种复杂的计算逻辑，是他的优点，也是他为人所诟病的地方，因为太复杂了，除了业务逻辑外还要写很多类型逻辑。


## TypeScript中的类型
基本数据类型：number、string、boolean、null、undefined、symbol、void、never、bigint
复合类型：Class、Array、Tuple、Enum、Interface、Function、Object

### 元组
元素个数和类型固定的数组类型
```typescript
let tuple: [string, number] = ['a', 1];
```
### 接口
描述函数、构造器、索引类型（对象、class、数组）等复合类型的结构
```typescript
// 对象
interface IPerson {
  name: string;
  age: number;
}

class Person implements IPerson {
  name: string;
  age: number;
}

const obj: IPerson = {
  name: 'guang',
  age: 18
}

// 函数
interface SayHello {
  (name: string): string;
}

const func: SayHello = function (name: string) {
  return `hello ${name}`;
}
// 构造器
interface PersonConstructor {
  new (name: string, age: number): IPerson
}

function createPerson (ctor: PersonConstuctor): IPerson {
  return new ctor('guang', 18);
}
```
对象类型、class 类型在 TypeScript 里也叫做索引类型，也就是索引了多个元素的类型的意思。
```typescript
interface IPerson {
  [key: string]: string | number;
}
const obj: IPerson = {};
obj.name = 'guang';
obj.age = 18;
```

### 枚举
```typescript
enum Transpiler {
  Babel = 'babel',
  TypeScriptCompiler = 'tsc',
  Terser = 'terser'
}
const transpiler = Transpiler.Babel;
```

TypeScript也支持字面量类型，也就是类似1111， 'aaaa'、{a: 1} 这种值也可以作为类型。
字符串字面量类型分为普通字符串字面量、模板字面量类型。
```typescript
function func(str: `#${string}`): void {}

func('#aaa');
```

## 四种特殊的类型
1. void：代表空，可以是undefined或者never，一般用于函数没有返回值。
2. never：代表永远不可达，一般用于函数抛出异常。
3. any: 是任意类型，任何类型都可以赋值给它，它也可以赋值给任何类型（除了never）。
4. unknown： 是未知类型，任何类型都可以赋值给它，但是它不能赋值给别的类型。


## 类型的装饰
