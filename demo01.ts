// 模式匹配提取类型


type p = Promise<'guang'>;

// 提取value的类型
// extends 条件类型 对传入的类型参数P做模式匹配，如果P是一个Promise类型，那么就返回Promise的泛型参数，否则返回never
// infer 关键字，用来推断出Promise的泛型参数 相当于一个变量，如果匹配成功，就把泛型参数赋值给这个变量
type ExtractPromiseValue<T> = T extends Promise<infer Value> ? Value : never;

type getValueType = ExtractPromiseValue<Promise<'guang'>>;
// type getValueType = "guang"
/**
 * 总结：
 * Typescript 类型的模式匹配是通过 extends 对类型参数做匹配，需要提取的部分保存到通过 infer 声明的局部类型变量里，
 * 如果匹配就能从该局部变量里拿到提取出的类型，做后续各种处理。
 */

// 该匹配模式在数组 字符串 函数 构造器中的应用

// 1 数组
type arr = [1, 2, 3]

// 1.1 数组——提取第一个元素类型
type ExtractFirstEleType<Arr extends unknown[]> = Arr extends [infer First , ...unknown[]] ? First : never;
type firstEle = ExtractFirstEleType<arr>;

/**
 * 这里any和unknow的区别，都代表任意类型，但是unknown只能接受任意类型的值，
 * 而any除了可以接受任意类型的值，还可以赋值给任意类型（除了never）
 * 类型体操中经常用unknown接受和匹配任何类型
 */

// 1.2 数组——提取最后一个元素类型
type ExtractLastEleType<Arr extends unknown[]> = Arr extends [...unknown[], infer last] ? last : never
type lastEleType = ExtractLastEleType<arr>;

// 1.3 数组——去掉了最后一个元素的数组类型
type ExtractRestArrTypeAfterRemoveLastEle<Arr extends unknown[]> = Arr extends [] ? [] : Arr extends [...infer Rest, unknown] ? Rest : never;
type restArrAfterRemoveLastEleType1 = ExtractRestArrTypeAfterRemoveLastEle<arr>;
type restArrAfterRemoveLastEleType2 = ExtractRestArrTypeAfterRemoveLastEle<[]>;

// 1.4 数组——去掉了第一个元素的数组类型
type ExtractRestArrTypeAfterRemoveFirstEle<Arr extends unknown[]> = Arr extends [] ? [] : Arr extends [unknown, ...infer Rest] ? Rest : never;
type restArrAfterRemoveFirstEleType1 = ExtractRestArrTypeAfterRemoveFirstEle<arr>;
type restArrAfterRemoveFirstEleType2 = ExtractRestArrTypeAfterRemoveFirstEle<[]>;

// 2 字符串
// 2.1 判断字符串是否以指定的前缀开始
type StartWith<Str extends string, prefix extends string> = Str extends `${prefix}${string}` ? true : false;
type isStartWithGuang1 = StartWith<'guang adn dong', 'guang'>
type isStartWithGuang2 = StartWith<'guang adn dong', 'dong'>

// 2.2 提取字符串想要的部分 构成新的类型
type ExtractStrSectionComposeNewType<Str extends string, From extends string, To extends string> = Str extends `${infer prefix}${From}${infer suffix}` ?
    `${prefix}${To}${suffix}` : Str;
type newStrType = ExtractStrSectionComposeNewType<'guang adn dong', 'guang', 'dong'>;

// 2.3 trim
type TrimStrRightType<Str extends string> = Str extends `${infer Rest}${' ' | '\n' | '\t'}` ? TrimStrRightType<Rest> : Str;
type TrimStrLeftType<Str extends string> = Str extends `${' ' | '\n' | '\t'}${infer Rest}` ? TrimStrLeftType<Rest> : Str;
type TrimType<Str extends string> = TrimStrRightType<TrimStrLeftType<Str>>;
// rimRight 和 TrimLeft 结合就是 Trim
type TrimResult = TrimType<'         dong  '>;

// 3 函数 

// 3.1 提取参数类型
type ExtractParamType<Func extends Function> = Func extends (...args: infer Args) => unknown ? Args : never;
type getFuncParamType = ExtractParamType<(a: string, b: number) => string>

// 3.2 提取返回值类型
type ExtractFuncReturnValueType<Func extends Function> = Func extends (...args: any[]) => infer ReturnType ? ReturnType : never;
type getFuncReturnValueType = ExtractFuncReturnValueType<(a: string, b: number) => string>

class Dong {
  name: string

  constructor() {
    this.name = "dong";
  }

  hello(this: Dong) {
    return "hello, i\'m " + this.name;
  }
}

const dong = new Dong()
dong.hello()

// 这里的报错是因为该对象不是Dong类型，所以this的类型不匹配
// dong.hello.call({ xxx: 'guang' })

type ExtractFuncThisValueType<Func extends Function> = Func extends (this: infer ThisType, ...args: any[]) => unknown ? ThisType : unknown
type getFuncThisValueType = ExtractFuncThisValueType<typeof dong.hello>

// 3.3 提取构造函数的实例类型
interface Person {
  name: string
}

interface PersonConstructor {
  new(name: string): Person
}

type ExtractInstanceType<CtorType extends new (...args: any) => any> = CtorType extends new (...args: any) => infer InstanceType ? InstanceType : never;
// 提取出PersonConstructor的实例类型Person
type instanceType = ExtractInstanceType<PersonConstructor>

// 3.4 提取构造函数的参数类型
type ExtractCtorParamType<CtorType extends new (...args: any) => any> = CtorType extends new (...args: infer Param) => any ? Param : never;
type instanceParamType = ExtractCtorParamType<PersonConstructor>

// 4 比如React的index.d.ts里PropsWithRef的高级类型定义 就是通过条件类型和infer来实现的
// 通过 keyof Props 取出 Props 的所有索引构成的联合类型，判断下 ref 是否在其中，也就是 'ref' extends keyof Props。
type PropsWithRef<P> =
  `ref` extends keyof P
    ? P extends { ref?: infer R | undefined }
      ? R : never
    : never;
type getRefPropsRes1 = PropsWithRef<{ ref: string, name: string }>
type getrefPropsRes2 = PropsWithRef<{ ref: undefined, name: string }>