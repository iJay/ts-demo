/**
 * 函数重载三种方法
 */

// 1. declare
declare function func1(name: number): number;
declare function func1(name: string): string;


function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: any, b: any): any {
  return a + b;
}
const addRe1 = add(1, 2);
const addRe2 = add('1', '2');

// 2. interface
interface func2 {
  (name: string): string;
  (name: number): number;
}
declare const func2: func2;
func2('1');
func2(1);
// func2(true); // error 没有与此调用匹配的重载

// 3. 交叉类型
type func3 = ((name: string) => string) & ((name: number) => number);
declare const func3: func3;
func3('1');
func3(1);
// func3(true); // error 没有与此调用匹配的重载


/**
 * UnionToTuple
 * 
 * 把联合类型转成元组类型
 * 也就是 'a' | 'b' | 'c' 转成 ['a', 'b', 'c']
 */


type demo15res01 = ReturnType<typeof func1> // type demo15res01 = string
type demo15res02 = ReturnType<typeof func2> // type demo15res02 = number
type demo15res03 = ReturnType<typeof func3> // type demo15res03 = number

// 以上 说明ReturnType 只能获取最后一个重载的返回值类型
