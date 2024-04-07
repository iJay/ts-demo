// 数组长度做计数（目前没有处理负数或浮点数的方案）

type num1 = [unknown]['length']

type num2 = [unknown, unknown]['length']

type num3 = []['length']

// 由此可知，数组的 length 属性可以获取数组的长度，这里用来做计数。
// TypeScript 类型系统中没有加减乘除运算符，但是可以通过构造不同的数组然后取 length 的方式来完成数值计算，把数值的加减乘除转化为对数组的提取和构造。(准确来说是元组)
// (严格来说构造的是元组)

// 1. 数组长度实现加减乘除
// 1.1 加法 Add
type Add<Num1 extends number, Num2 extends number> =
  [...BuildArray<Num1>, ...BuildArray<Num2>]['length']

type TestAdd = Add<20, 32> // 52

// 1.2 减法 Subtract
type Subtract<Num1 extends number, Num2 extends number> =
  BuildArray<Num1> extends [...Arr1: BuildArray<Num2>, ...Arr2: infer Rest]
  ? Rest['length']
  : never
// tips: 元组成员或者全部有名字，或者全部没有名字，不能混用。去掉去掉 arr1 就会报错。
type TestSubtract = Subtract<50, 32> // 18

// 1.3 乘法 Multiply
type Multiply<Num1 extends number, Num2 extends number, ResultArr extends unknown[]> =
  Num2 extends 0
  ? ResultArr['length']
  : Multiply<Num1, Subtract<Num2, 1>, [...BuildArray<Num1>, ...ResultArr]>
// 实现思路：每次递归将 Num1 数组和 ResultArr 数组拼接，直到 Num2 为 0，返回 ResultArr 的长度。
type TestMultiply01 = Multiply<3, 4, []> // 12
type TestMultiply02 = Multiply<0, 3, []> // 0

// 1.4 除法 Divide
type Devide<Num1 extends number, Num2 extends number, DevideCount extends unknown[]> =
  Num1 extends 0
    ? Devide<Subtract<Num1, Num2>, Num2, [unknown, ...DevideCount]>:
    DevideCount['length']
// 实现思路：每次递归减去一次被除数，记录一次递归次数，直到被除数等于0，递归的次数就是商。
type TestDevide01 = Devide<20, 5, []> // 4
type TestDevide02 = Devide<20, 0, []> // 20
// 2 字符串长度实现计数

// 2.1 StrLength
type StrLength<Str extends string, CountArr extends unknown[]> =
  Str extends `${string}${infer RestStr}`
    ? StrLength<RestStr, [...CountArr, unknown]>
    : CountArr['length']
// 实现思路：每次递归去掉字符串的第一个字符，然后将一个元素放到 CountArr 数组中，直到字符串为空，返回 CountArr 的长度。
type TestStrLength = StrLength<'guangdong', []> // 9

// 2.2 GreaterLength
type GreaterLength<Num1 extends number, Num2 extends number, CountArr extends unknown[]> =
  Num1 extends Num2
    ? false
    : CountArr['length'] extends Num2
      ? true
      : CountArr['length'] extends Num1
        ? false
        : GreaterLength<Num1, Num2, [...CountArr, unknown]>
type TestGreaterLength01 = GreaterLength<5, 3, []> // true
type TestGreaterLength02 = GreaterLength<3, 5, []> // false
type TestGreaterLength03 = GreaterLength<3, 3, []> // false
// 实现思路：往一个数组类型中不断放入元素取长度，如果先到了 A，那就是 B 大，否则是 A 大
// 2.3 Fibonacci
// Fibonacci 数列是 1、1、2、3、5、8、13、21、34、…… 这样的数列，有当前的数是前两个数的和的规律。
// F(0) = 1，F(1) = 1, F(n) = F(n - 1) + F(n - 2)（n ≥ 2，n ∈ N*)