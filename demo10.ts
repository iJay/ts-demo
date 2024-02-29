// 特殊类型的特性
// 类型的判断要根据它的特性来，比如判断联合类型就要根据它的 distributive 的特性。

// isAny 判断一个类型是否是 any 类型
// any类型特性 与任何类型交叉都是 any 类型，比如1 & any = any

type isAny<T> = 'a' extends ('b' & T) ? true : false
type isAnyResult1 = isAny<any> // true
type isAnyResult2 = isAny<unknown> // false
