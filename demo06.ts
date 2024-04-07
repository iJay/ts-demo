// 重新构造做变换

// TypeScript 类型系统支持 3 种可以声明任意类型的变量： type、infer、类型参数。这 3 种变量的区别是：
// type：类型别名，其实就是声明一个变量存储某个类型。
// infer：用于类型的提取，然后存到一个变量里，相当于局部变量。
// 类型参数：用于接受具体的类型，在类型运算中也相当于局部变量。

type ttt = Promise<number>

type GetValueType<P> = P extends Promise<infer ValueType> ? ValueType : never

type isTwo<T> = T extends 2 ? true : false

// 严格来说这三种也都不叫变量，因为它们不能被重新赋值。
// TypeScript 设计可以做类型编程的类型系统的目的就是为了产生各种复杂的类型, 通过重新构造做变换来产生复杂类型

type tuple = [1, 2, 3]

// 1.1 push 给上面这个元组类型再添加一些类型 构造一个新的元组类型
type Push<Arr extends unknown[], Ele> = [...Arr, Ele]

type pushResult = Push<[1, 2, 3], 4>

// 1.2 unshift 给上面这个元组类型再添加一些类型 构造一个新的元组类型
type Unshift<Arr extends unknown[], Ele> = [Ele, ...Arr]

type unshiftResult = Unshift<[1, 2, 3], 0>

// 1.3 合并元组
type tuple1 = [1, 2];
type tuple2 = ["guang", "dong"];

type Zip<ArrOne extends [unknown, unknown], ArrTwo extends [unknown, unknown]> = ArrOne extends [infer OneFirst, infer OneSecond] ? ArrTwo extends [infer TwoFirst, infer TwoSecond] 
  ? [[OneFirst, TwoFirst], [OneSecond, TwoSecond]] : [] : []

type ZipResult = Zip<tuple1, tuple2>

// 1.4 递归合并元组
type ResuiveZip<ArrOne extends unknown[], ArrTwo extends unknown[]> =
  ArrOne extends [infer OneFirst, ...infer OneRest] ? ArrTwo extends [infer TwoFirst, ...infer TwoRest] 
    ? [[OneFirst, TwoFirst], ...ResuiveZip<OneRest, TwoRest>]: []
     : []

type ResuiveZipResult = ResuiveZip<[1, 2, 3, 4, 5], ['one', 'two', 'three', 'four', 'five']>

// 2 字符串类型的重新构造
// 从已有的字符串类型中提取出一些部分字符串，经过一系列变换，构造成新的字符串类型。

// 2.1 把一个字符串字面量类型的 'guang' 转为首字母大写的 'Guang'
// 这里使用 TypeScript 提供的内置高级类型 Uppercase 把首字母转为大写
type CapitalizeStr<Str extends string> = Str extends `${infer First}${infer Rest}` ? `${Uppercase<First>}${Rest}` : Str

type CapitalizeStrResult = CapitalizeStr<'guang'>

// 2.2 实现 dong_dong_dong 到 dongDongDong 的变换
type CamelCaseStr<Str extends string> = Str extends `${infer Left}_${infer Right}${infer Rest}` ? `${Left}${Uppercase<Right>}${CamelCaseStr<Rest>}` : Str
type CamelCaseStrResult = CamelCaseStr<'dong_dong_dong'>

// 2.3 删除一段字符串
type DropSubStr<Str extends string, SubStr extends string> = Str extends `${infer Prefix}${SubStr}${infer Suffix}` ? DropSubStr<`${Prefix}${Suffix}`, SubStr> : Str;
type DropSubStrResult = DropSubStr<'dongguangdong', 'dong'>

// 3 函数类型的重新构造

// 3.1 在已有的函数类型上添加一个参数
type FuncAppendArgs<Func extends Function, Arg> = Func extends (...args: infer Args) => infer ReturnValueType ? (...args: [...Args, Arg]) => ReturnValueType : never
type FuncAppendArgsResult = FuncAppendArgs<(a: string, b: number) => string, boolean>


// 4 索引类型的重新构造

// 索引类型是聚合多个元素的类型，class、对象等都是索引类型
type objOne = {
  name: string,
  age: number,
  gender: boolean
}

type objTwo = {
  readonly name: string,  // 只读属性
  age?: number, // 可选属性
  gender: boolean
}
// 1.1 对索引类型的修改和构造新类型涉及到了映射类型的语法
type Mapping1<obj extends object> = {
  [Key in keyof obj]: obj[Key]
}

// 也可以做如下修改
type Mapping2<obj extends object> = {
  [Key in keyof obj]: [Key, obj[Key]]
}

type res1 = Mapping1<{a: 1, b: 2}>
type res2 = Mapping2<{a: 1, b: 2}>

// 1.2 可以对Key修改，也可以对 Key 做修改，比如：索引类型的 Key 变为大写
type UpperCaseKey<Obj extends object> = {
  [Key in keyof Obj as Uppercase<Key & string>]: Obj[Key]
}
// 类型参数 Obj 是待处理的索引类型，通过 extends 约束为 object
// 新的索引类型的索引为 Obj 中的索引，也就是 Key in keyof Obj，但要做一些变换，也就是 as 之后的
// 通过 Uppercase 把索引 Key 转为大写，因为索引可能为 string、number、symbol 类型，
// 而这里只能接受 string 类型，所以要 & string，也就是取索引中 string 的部分。
type UpperCaseKeyResult = UpperCaseKey<{ guang: 1, dong: 2}>

// 1.3 Record
// TypeScript 提供了内置的高级类型 Record 来创建索引类型。
// Record<K, T> 的作用是构造一个类型，这个类型的属性名是 K 中的属性，属性值是 T 类型。
type RecordMock<K extends string | number | symbol, T> = { [P in K] : T }
// 上面的索引类型的约束我们用的 object 更语义化一点推荐用Record<string, any>

type UpperCaseKey2<Obj extends Record<string, any>> = {
  [Key in keyof Obj as Uppercase<Key & string>]: Obj[Key]
}

// 1.4 ToReadonly
type ToReadonly<T> = {
  readonly [Key in keyof T]: T[Key]
}

type ReadonlyResult = ToReadonly<{ name: 'leohan', age: 33}>

// 1.5 ToPartial
type ToPartial<T> = {
  [Key in keyof T]?: T[Key]
}

type PartialResult = ToPartial<{ name: 'leohan', age: 33}>

// 1.6 ToMutable去掉readonly 修饰
type ToMutable<T> = {
  -readonly [Key in keyof T]: T[Key]
}

type MutableResult = ToMutable<{ readonly name: 'leohan', age: 33}>

// 1.7 可选修饰符
type ToRequired<T> = {
  [Key in keyof T]-?: T[Key]
}

type RequiredResult = ToRequired<{name: 'leohan', age?: 33}>

// 1.8 构造新索引类型的时候根据值的类型做下过滤
type FilterByValueType<obj extends Record<string, any>, ValueType> = {
  [Key in keyof obj as obj[Key] extends ValueType ? Key : never]: obj[Key]
}

interface Person {
  name: string,
  age: number;
  hobby: string[]
}
// 对索引做修改的 as 叫做重映射
type FilterResult = FilterByValueType<Person, string | number>