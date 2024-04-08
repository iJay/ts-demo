
/**
 * 题目：实现一个type类型，用于约束特殊时间格式的字符串
 * 例子：
 *   FormatDate<"DD-MM-YY">
 *   允许的字符串为：
 *   const date: FormatDate<"DD-MM-YY"> = "12-12-2024" | "12-02-2024";
 *   不允许的字符串为：
 *   const date: FormatDate<"DD-MM-YY"> = "112-12-2024" | "12-112-2024" | "12-12-12024" | ...
 * 时间格式支持多种分隔符："-" | "." | "/"
 */

type Seperator = '-' | '.' | '/';

type Num = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type Num2 = Num | 0

type YY = `19${Num2}${Num2}` | `20${Num2}${Num2}`;

type MM = `0${Num}` | `1${0 | 1 | 2}`;

type DD = `${0}${Num}` | `${1 | 2}${Num2}` | `3${0 | 1}`;

type GenStr<Type extends string> = 
  Type extends 'YY'
    ? YY
    : Type extends 'MM'
      ? MM
      : DD;

type FormatDate<Pattern extends string> = 
  Pattern extends `${infer Aaa}${Seperator}${infer Bbb}${Seperator}${infer Ccc}`
    ? Pattern extends `${Aaa}${infer Sep}${Bbb}${string}${Ccc}`
      ? `${GenStr<Aaa>}${Sep}${GenStr<Bbb>}${Sep}${GenStr<Ccc>}`
      : never
    : never;

const a: FormatDate<'YY-MM-DD'> = '2023-01-02';

const b: FormatDate<'DD/MM/YY'> = '01/02/2024';

// const c: FormatDate<'YY.MM.DD'> = '2024-01-02'; // error

// tips： 这里的${infer _}：用于模板字符串的模式匹配中，表示我们不关心该部分的匹配结果，通常用于忽略不感兴趣的部分。