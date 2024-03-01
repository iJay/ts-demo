type ParseQueryString<Str extends string> =
  Str extends `${infer FirstKeyValueStr}&${infer RestStr}`
  ? MergeParams<ParseParam<FirstKeyValueStr>, ParseQueryString<RestStr>>
  : ParseParam<Str>

type ParseParam<Params extends string> =
  Params extends `${infer Key}=${infer Value}`
  ? { [k in Key]: Value }
  :  Record<string, any>
// 测试一下ParseParam
type TestParseParam = ParseParam<'a=1'>

type MergeParams<A extends Record<string, any>, B extends Record<string, any>> = {
  [Key in keyof A | keyof B]:
  Key extends keyof A
    ? Key extends keyof B
      ? MergeValues<A[Key], B[Key]>
      : A[Key]
    : Key extends keyof B
      ? B[Key]
      :never
}

type MergeValues<A, B> = 
  A extends B
  ? A
  : B extends unknown[]
    ? [A, ...B]
    : [A, B]

type TestMergeValuesResult1 = MergeValues<1, 2> // [1, 2]
type TestMergeValuesResult2 = MergeValues<1, 1> // 1
type TestMergeValuesResult3 = MergeValues<1, [2]> // [1, 2]

type TestParseQueryString = ParseQueryString<'a=1&b=2&c=3'> // { a: "1", b: "2", c: "3" }