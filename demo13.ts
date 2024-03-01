// 类型编程的意义
// 总体来说：类型编程可以动态生成类型，对已有类型做修改。比如返回值的类型和参数的类型有一定的关系，需要经过计算才能得到。

// 1. parseQueryString
// @ts-nocheck
function parseQueryString1(queryStr) {
  if (!queryStr || !queryStr.length) {
      return {};
  }
  const queryObj = {};
  const items = queryStr.split('&');
  items.forEach(item => {
      const [key, value] = item.split('=');
      if (queryObj[key]) {
          if(Array.isArray(queryObj[key])) {
              queryObj[key].push(value);
          } else {
              queryObj[key] = [queryObj[key], value]
          }
      } else {
          queryObj[key] = value;
      }
  });
  return queryObj;
}
// 进一步优化
function parseQueryString2(queryStr: string): Record<string, any> {
  if (!queryStr || !queryStr.length) {
      return {};
  }
  const queryObj = {};
  const items = queryStr.split('&');
  items.forEach(item => {
      const [key, value] = item.split('=');
      if (queryObj[key]) {
          queryObj[key] = Array.isArray(queryObj[key]) ? queryObj[key].push(value) : [queryObj[key], value]
      } else {
          queryObj[key] = value;
      }
  });
  return queryObj;
}

const result1301 = parseQueryString2('a=1&b=2&c=3&d=4&a=5');

// 在进一步优化
// 这里最好通过函数重载的方式来声明类型，不然返回值可能和 ParseQueryString 的返回值类型匹配不上，需要as any才行，那样比较麻烦。
function parseQueryString3<Str extends string>(queryStr: Str): ParseQueryString<Str>
function parseQueryString3(queryStr: string) {
  if (!queryStr || !queryStr.length) {
      return {};
  }
  const queryObj = {};
  const items = queryStr.split('&');
  items.forEach(item => {
      const [key, value] = item.split('=');
      if (queryObj[key]) {
          queryObj[key] = Array.isArray(queryObj[key]) ? queryObj[key].push(value) : [queryObj[key], value]
      } else {
          queryObj[key] = value;
      }
  });
  return queryObj;
}

const result1302 = parseQueryString3('a=1&b=2&c=3&d=4');
console.log(result1302.a)

// Promise.all

