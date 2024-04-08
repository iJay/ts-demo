
// 重载函数的类型是从上到下依次匹配，只要匹配到一个就应用。


function zip<Target extends unknown[], Source extends unknown[]>(target: Target, source: Source): Zip2<Target, Source>
// 这里只是用来接收其他类型， 所以 unknown 比any 更合适一些，更安全。
function zip(target: unknown[], source: unknown[]): unknown[]


function zip(target: unknown[], source: unknown[]) {
  if (target.length === 0 || source.length === 0) {
    return [];
  }

  const [targetFirst, ...targetRest] = target;
  const [sourceFirst, ...sourceRest] = source;
  return [[targetFirst, sourceFirst], ...zip(targetRest, sourceRest)];
}

type Zip2<One extends unknown[], Other extends unknown[]> =
    One extends [infer OneFirst,...infer Rest1]
      ? Other extends [infer OtherFirst, ...infer Rest2]
        ? [[OneFirst, OtherFirst], ...Zip2<Rest1, Rest2>]
        : []
      : [];
const res = zip([1, 2, 3], [4, 5, 6]);
const arr1 = [1, 2, 3];
const arr2 = [4, '5', 6];

const result2 = zip(arr1, arr2);

