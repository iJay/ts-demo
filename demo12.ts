// ts内置高级类型

// 1. Parameters
type TestParameters = Parameters<(a: number, b: string) => any> //  [a: number, b: string]

// 2. ReturnType
type TestReturnType = ReturnType<(a: number, b: string) => string> // string

// 3. ConstructorParameters
interface PersonCtor {
  new(name: string): Person
}
type TestConstructorParameters = ConstructorParameters<PersonCtor> // [string]

// 4. InstanceType
type TestInstanceType = InstanceType<PersonCtor> // Person

// 5. ThisParameterType
type Person1201 = {
  name: 'guang'
}

function hello(this: Person1201) {
  console.log(this.name)
}

// hello.call({ name: 'dong' })
type TestThisParameterType = ThisParameterType<typeof hello> // Person

// 6. OmitThisParameter 利用ThisParameterType提取this 并返回一个新函数
function say(this: Person1201, word: string) {
  console.log(this.name + ' say ' + word)
}

type TestThisOmitParameter = OmitThisParameter<typeof say> // (word: string) => void

// 7. Partial 可以通过映射类型的语法做修改，比如把索引变为可选
type TestPartial = Partial<{ a: number, b: string }> // { a?: number, b?: string }

// 8. Required
type TestRequired = Required<{ a?: number, b?: string }> // { a: number, b: string }

// 9. Readonly
type TestReadonly = Readonly<{ a: number, b: string }> // { readonly a: number, readonly b: string }

// 10. Pick 用于构造新的索引类型，在构造的过程中可以对索引和值做一些修改或过滤。
type TestPick = Pick<{ a: number, b: string, c: boolean }, 'a' | 'b'> // { a: number, b: string }

// 11. Record  用于创建索引类型，传入 key 和值的类型
// 源码实现中用到了keyof any它的返回结果是一个联合类型string | number | symbol
// 如果开启了 keyOfStringsOnly 的编译选项，它就只是 stirng 了
type res = keyof any // string | number | symbol
type TestRecord = Record<'a' | 'b', 1>

// 12. Exclude 用于从联合类型中排除某些类型
type TestExclude = Exclude<'a' | 'b' | 'c' | 'd', 'a' | 'b'>

// 13. Extract 用于从联合类型中提取某些类型
type TestExtract = Extract<'a' | 'b' | 'c' | 'd', 'a' | 'b'>

// 14. Omit 用于从对象中排除某些属性
type TestOmit = Omit<{ a: number, b: string, c: boolean }, 'a' | 'b'> // { c: boolean }

// 15. Awaited 用于获取 Promise 返回值的类型
type TestAwaited = Awaited<Promise<Promise<Promise<string>>>> // string

// 16. NonNullable 用于判断是否为非空类型，也就是不是 null 或者 undefined 的类型
type TestNonNullable1 = NonNullable<string | null | undefined> // string
type TestNonNullable2 = NonNullable<null | undefined> // string | number

// 17. Uppercase Lowercase Capitalize Uncapitalize 用于字符串的大小写转换
type TestUppercase = Uppercase<'abc'> // ABC 全部转为大写
type TestLowercase = Lowercase<'ABC'> // abc 全部转为小写
type TestCapitalize = Capitalize<'abc'> // Abc 首字母大写
type TestUncapitalize = Uncapitalize<'Abc'> // abc 首字母小写


/**
 * 总结：
 * 用模式匹配实现：Parameters、ReturnType、ConstructorParameters、InstanceType、ThisParameterType
 * 用模式匹配 + 重新构造实现：OmitThisParameter
 * 用重新构造可以实现：Partial、Required、Readonly、Pick、Record
 * 用模式匹配 + 递归实现：Awaited
 * 用联合类型在分布式条件类型的特性可以实现：Exclude
 * NonNullable 和四个编译器内部实现：Uppercase、Lowercase、Capitalize、Uncapitalize
 */