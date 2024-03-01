// 特殊类型的特性
// 类型的判断要根据它的特性来，比如判断联合类型就要根据它的 distributive 的特性。

// isAny 判断一个类型是否是 any 类型
// any类型特性 与任何类型交叉都是 any 类型，比如1 & any = any

type isAny<T> = 'a' extends ('b' & T) ? true : false
type isAnyResult1 = isAny<any> // true
type isAnyResult2 = isAny<unknown> // false

// isEqual 判断两个类型是否相等
// 这里是利用了源码中的特性, 两个条件类型判断相关性的时候会判断右边部分是否相等
// 而T在函数中是一个泛型, 所以会被推断为不同的类型
type isEqual<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? true : false
type isEqualResult1 = isEqual<1, any> // false

// isUnion 判断联合类型
type isUnion<A, B = A> =
  A extends A
    ? [B] extends [A]
      ? false
      : true
    : never

type isUnionResult1 = isUnion<1 | 2> // true
type isUnionResult2 = isUnion<1> // false

// 判断never类型
// 这里利用了never类型的特性, 如果条件类型左边是类型参数，并且传入的是never类型，那么就会返回never类型
type TestNever<T> = T extends number ? 1 : 2
type TestNeverResult1 = TestNever<never> // never
type TestNeverResult2 = TestNever<number> // 1

type isNever<T> = [T] extends [never] ? true : false
type isNeverResult1 = isNever<never> // true
type isNeverResult2 = isNever<number> // false
type isNeverResult3 = isNever<any> // false

// 判断元组类型
// 利用元组类型的length是数字字面量，而数组的length是number类型的特性
// [...params: infer Eles]这样的写法
type len = [1, 2, 3]['length'] // 3
type len2 = number[]['length'] // number
type IsTuple<T> =
  T extends [...params: infer Eles]
    ? NotEqual<Eles['length'], number>
    : false

type NotEqual<A, B> = (<T>() => T extends A ? 1 : 2) extends (<T>() => T extends B ? 1 : 2) ? false : true

type IsTupleResult1 = IsTuple<[1, 2, 3]> // true
type IsTupleResult2 = IsTuple<number[]> // false


// GetOptional
type GetOptional<Obj extends Record<string, any>> =
{
  [
    Key in keyof Obj
      as {} extends Pick<Obj, Key> ? Key : never
  ]: Obj[Key]
}

type GetOptionalResult = GetOptional<{ a: number, b?: string }> // { b?: string }

// GetRquired
type isRequired<Key extends keyof Obj, Obj> =
  {} extends Pick<Obj, Key>
  ? never
  : Key

type GetRequired<Obj extends Record<string, any>> = {
  [Key in keyof Obj as isRequired<Key, Obj>] : Obj[Key]
}

type GetRequiredResult = GetRequired<{ a: number, b?: string, c: boolean }> // { a: number, c: boolean }

// ClassPublicProps
// 根据keyof 只能拿到 class 的 public 索引，private 和 protected 的索引会被忽略的特性

type ClassPublicProps<T extends Record<string, any>> = {
  [
    Key in keyof T
  ]: T[Key]
}
class Dong1001 {
  public name: string;
  protected age: number;
  private hobbies: string[];

  sayHello() {
    //
  }

  constructor() {
    this.name = 'dong';
    this.age = 20;
    this.hobbies = ['sleep', 'eat'];
  }
}

type ClassPublicPropsResult = ClassPublicProps<Dong1001> // { a: number, b: string, c: boolean }

// asConst
// TypeScript 默认推导出来的类型并不是字面量类型。

const obj = {
  a: 1,
  b: 2
}
type objType = typeof obj

const arr = [1, 2, 3]
type arrType = typeof arr

// 需要推导出字面量类型的，这时候就需要用 as const
const obj1002 = {
  a: 1,
  b: 2
} as const
// 加上 as const 之后推导出来的类型是带有 readonly 修饰的，所以再通过模式匹配提取类型的时候也要加上 readonly 的修饰才行
type objType2 = typeof obj1002 // { readonly a: 1, readonly b: 2 } 
const arr1002 = [1, 2, 3] as const

type arrType2 = typeof arr1002 // readonly [1, 2, 3]
/**
 * const 是常量的意思，也就是说这个变量首先是一个字面量值，而且还不可修改，有字面量和 readonly 两重含义。
 * 所以加上 as const 会推导出 readonly 的字面量类型。
 */

type reverseArr1001<Arr> = Arr extends [infer A, infer B, infer C] ? [C, B, A] : never
type reverseArr1001Result = reverseArr1001<arrType2> // never

type reverseArr1002<Arr> = Arr extends readonly [infer A, infer B, infer C] ? [C, B, A] : never
type reverseArr1002Result = reverseArr1002<arrType2> // readonly [3, 2, 1]

/**
 * 总结：
 * any 类型与任何类型的交叉都是 any，也就是 1 & any 结果是 any，可以用这个特性判断 any 类型。
 * 联合类型作为类型参数出现在条件类型左侧时，会分散成单个类型传入，最后合并。
 * never 作为类型参数出现在条件类型左侧时，会直接返回 never。
 * any 作为类型参数出现在条件类型左侧时，会直接返回 trueType 和 falseType 的联合类型。
 * 元组类型也是数组类型，但 length 是数字字面量，而数组的 length 是 number。可以用来判断元组类型。
 * 函数参数处会发生逆变，可以用来实现联合类型转交叉类型。
 * 可选索引的索引可能没有，那 Pick 出来的就可能是 {}，可以用来过滤可选索引，反过来也可以过滤非可选索引。
 * 索引类型的索引为字符串字面量类型，而可索引签名不是，可以用这个特性过滤掉可索引签名。
 * keyof 只能拿到 class 的 public 的索引，可以用来过滤出 public 的属性。
 * 默认推导出来的不是字面量类型，加上 as const 可以推导出字面量类型，但带有 readonly 修饰，这样模式匹配的时候也得加上 readonly 才行。
 */