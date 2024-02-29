// 联合类型

// 分布式条件类型
/**
 * 当类型参数为联合类型，并且在条件类型左边直接引用该类型参数的时候，
 * TypeScript 会把每一个元素单独传入来做类型运算，最后再合并成联合类型，
 * 这种语法叫做分布式条件类型。
 */
type union = 'a' | 'b' | 'c'

// 把其中的a变为大写
// 这里的Str是联合类型，所以会分别把联合类型的每一个元素传入到条件类型中做运算
type UpperCaseA<Str extends string> =
  Str extends 'a' ? `${Uppercase<Str>}` : Str

type UppercaseResult = UpperCaseA<union>

// CamelcaseUnion 提取字符串中的字符，首字母大写以后重新构造字符串
type Camelcase<Str extends string> = 
  Str extends `${infer Left}_${infer Right}${infer RestStr}`
  ? `${Left}${Uppercase<Right>}${Camelcase<RestStr>}`
  : Str

type CamelcaseResult = Camelcase<'guang_dong'>
// 这里对联合类型的处理和字符串一样，会分别把联合类型的每一个元素传入到条件类型中做运算，最后再合并成联合类型
type CamelcaseResult2 = Camelcase<'guang_dong_dong' | 'al_al_al'> // "guangDongDong" | "alAlAl"

// IsUnion 判断联合类型
type IsUnion<A, B = A> = // A extends A 这段看似没啥意义，主要是为了触发分布式条件类型，让 A 的每个类型单独传入。
  A extends A
    ? [B] extends [A] 
      ? false : true
  : never

type isUnionResult = IsUnion<'a' | 'b'> // true

// 为什么判断是否是联合类型的代码这么写？
// 这里先看一下类型操作里传入联合类型会有什么效果
type TestUnion<A, B = A> = A extends A ? {a: A, b : B} : never
type testUnionResult = TestUnion<'A' | 'B'> // {a: "A" | "B", b: "A" | "B"}

// 从上面结果可以得知条件类型中如果左边是联合类型，那么会把联合类型的每一个元素单独传入来做类型运算，而右边的类型参数则会保持不变
/**
 * notes:
 * 当 A 是联合类型时
 * A extends A 这种写法是为了触发分布式条件类型，让每个类型单独传入处理的，没别的意义。
 * A extends A 和 [A] extends [A] 是不同的处理，前者是单个类型和整个类型做判断，
 * 后者两边都是整个联合类型，因为只有 extends 左边直接是类型参数才会触发分布式条件类型。
 */
type TestUnion2<A, B = A> = A extends A ? B extends A ? {a: A, b : B} : never : never
type testUnionResult2 = TestUnion2<'A' | 'B'> // => { a: "A"; b: "A";} | { a: "B"; b: "B";}


// Bem
type benResult = BEM<'guang', ['aaa', 'bbb'], ['warning', 'success']> // guang_aaa--warning" | "guang_aaa--success" | "guang_bbb--warning" | "guang_bbb--success
// Bem的实现 如果传入的是数组，要递归遍历取出每一个元素来和其他部分组合，这样太麻烦了。
// 使用联合类型的话，联合类型遇到字符串也是会单独每个元素单独传入做处理。
// 这里我们把数组转为联合类型，然后再传入到条件类型中做处理。
type union0901 = ['aaa', 'bbb'][number] // "aaa" | "bbb"

type BEM<
  Block extends string,
  Element extends string[],
  Modifiers extends string[]
> = `${Block}_${Element[number]}--${Modifiers[number]}` // 这里构造的字符串类型，其中 Element 和 Modifiers 通过索引访问来变为联合类型。

// AllCombinations 全组合的高级类型
type Combinations<A extends string, B extends string> = 
  | A
  | B
  | `${A} ${B}`
  | `${B} ${A}`
type combinationsResult = Combinations<'a', 'b'> // "a" | "b" | "a b" | "b a"

type AllCombinations<A extends string, B extends string = A> =
  A extends A
    ? Combinations<A, AllCombinations<Exclude<B, A>>>
    : never
// 这里的Exclude<B, A>是把B中的A排除掉，然后再传入到Combinations中做处理