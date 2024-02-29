// 递归复用
// 类型的提取和构造还不够，有时候提取或构造的数组元素个数不确定、字符串长度不确定、对象层数不确定，这时候就需要递归类型来处理了。
// 总之，在类型操作里，遇到数量不确定的问题，就要条件反射的想到递归

// 1 Promise的递归

type ppp = Promise<Promise<Promise<Record<string, any>>>>

type DeepExtractPromiseValueType1<P extends Promise<unknown>> =
  P extends Promise<infer ValueType>
    ? ValueType extends Promise<unknown>
      ? DeepExtractPromiseValueType1<ValueType>
      : ValueType 
    : never

type DeepExtractPromiseValueTypeResult = DeepExtractPromiseValueType1<ppp>

// DeepExtractPromiseValueType2不再约束类型参数必须是 Promise，这样就可以少一层判断。

type DeepExtractPromiseValueType2<P> = 
  P extends Promise<infer ValueType>
    ? DeepExtractPromiseValueType2<ValueType>
    : P

type pppn = Promise<Promise<Promise<number>>>

type DeepExtractPromiseValueTypeResult2 = DeepExtractPromiseValueType2<pppn>


// 2 数组类型的递归

// 2.1 反转数组类型 Reverse
type arr0301 = [1, 2, 3, 4, 5] // => [5, 4, 3, 2, 1]

type ReverseArr<Arr extends unknown[]> = Arr extends [infer FirstEle, ...infer RestArr]
  ? [...ReverseArr<RestArr>, FirstEle]:
  Arr

type ReverseArrResult = ReverseArr<arr0301>

// 2.2 查找元素 Includes 比如查找 [1, 2, 3, 4, 5] 中是否存在 4
type arr0302 = [1, 2, 3, 4, 5]

type IncludesEle<Arr extends unknown[], EleItem> =
  Arr extends [infer FirstEle, ...infer RestArr]
  ? IsEqual<FirstEle, EleItem> extends true
    ? true
    : IncludesEle<RestArr, EleItem>
  : false

  type IsEqual<A, B> =(A extends B ? true : false) & (B extends A ? true : false)

type IncludesEleResult1 = IncludesEle<arr0302, 4>
type IncludesEleResult2 = IncludesEle<arr0302, 6>

// 2.3 删除元素并返回新的数组类型

// 类型参数 Arr 是待处理的数组，元素类型任意，也就是 unknown[]。
// 类型参数 Item 为待查找的元素类型。
// 类型参数 Result 是构造出的新数组，默认值是 []。
// 这里删除并不是真正的删除，而是构造一个新的数组，把不等于 Item 的元素放进去。
type RemoveItem<Arr extends unknown[], Item, Result extends unknown[] = []> =
  Arr extends [infer FirstItem, ...infer RestArr]
    ? IsEqual<FirstItem, Item> extends true
      ? RemoveItem<RestArr, Item, Result>
      : RemoveItem<RestArr, Item, [...Result, FirstItem]>
  : Result

type RemoveItemResult1 = RemoveItem<[1, 2, 3, 4, 5], 4, []>
type RemoveItemResult2 = RemoveItem<[1, 2, 3, 4, 5], 6, []>

// 2.4 BuildArray 构造数组类型元素个数不确定，也需要递归
// 其实现思路也是递归，每次递归都把当前的元素类型放到数组中，直到达到指定的个数。
type BuildArray<Length extends number, Ele = unknown, Arr extends unknown[] = []> =
  Arr['length'] extends Length
    ? Arr
    : BuildArray<Length, Ele, [...Arr, Ele]>
type arr0303 = ['1']
type BuildArrayResult1 = BuildArray<5, string, arr0303>
type BuildArrayResult2 = BuildArray<5>

// 3 字符串类型的递归

// 3.1 字符串递归替换
type ReplaceStrResuive<Str extends string, From extends string, To extends string> =
  Str extends `${infer Left}${From}${infer Right}`
    ? `${Left}${To}${ReplaceStrResuive<Right, From, To>}`
    : Str

type ReplaceStrResuiveResult = ReplaceStrResuive<'guangdongguangdong', 'guang', 'dong'>


// 3.2 把字符串字面量类型的每个字符都提取出来组成联合类型
type StringToUnionType<Str extends string> =
  Str extends `${infer FirstStr}${infer RestStr}`
    ? FirstStr | StringToUnionType<RestStr>
    : never;

type StringToUnionTypeResult = StringToUnionType<'guangdong'>

// 3.3 反转字符串
type ReverseStrType<Str extends string> =
  Str extends `${infer FirstStr}${infer RestStr}`
    ? `${ReverseStrType<RestStr>}${FirstStr}`
    : Str

type ReverseStrTypeResult = ReverseStrType<'guangdong'>

// 4 对象类型递归

// 4.1 给索引加上了 readonly 的修饰，对象属性层级深度不确定


// 这里没有计算 是因为ts的类型只有被用到的时候才会做计算
// 可以在前面加上一段 Obj extends never ? never 或者 Obj extends any 等，从而触发计算
type ResuiveReadonlyResult<Obj extends Record<string, any>> = 
Obj extends any ? {
  readonly [Key in keyof Obj] : Obj[Key] extends object
    ? Obj[Key] extends Function
      ?Obj[Key]
      : ResuiveReadonlyResult<Obj[Key]>
    : Obj[Key]
} : never

type obj = {
  a: {
      b: {
          c: {
              f: () => 'dong',
              d: {
                  e: {
                      guang: string
                  }
              }
          }
      }
  }
}

type ResuiveReadonlyResultResult = ResuiveReadonlyResult<obj>['a']



/**
 * 总结
 * 归是把问题分解成一个个子问题，通过解决一个个子问题来解决整个问题。形式是不断的调用函数自身，直到满足结束条件。
 * 在 TypeScript 类型系统中的高级类型也同样支持递归，在类型体操中，遇到数量不确定的问题，要条件反射的想到递归。 
 * 比如数组长度不确定、字符串长度不确定、索引类型层数不确定等。
 */