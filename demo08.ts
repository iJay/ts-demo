// 数组长度做计数

type num1 = [unknown]['length']

type num2 = [unknown, unknown]['length']

type num3 = []['length']

// 由此可知，数组的 length 属性可以获取数组的长度，这里用来做计数。
// TypeScript 类型系统中没有加减乘除运算符，但是可以通过构造不同的数组然后取 length 的方式来完成数值计算，把数值的加减乘除转化为对数组的提取和构造。
// (严格来说构造的是元组)

// 这一章节先跳过，后续再补充