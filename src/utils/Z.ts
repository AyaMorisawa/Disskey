export default <T, S>(f: (_f: (_x: T) => S) => (__x: T) => S) => ((x: any) => f(y => x(x)(y)))((x: any) => f(y => x(x)(y)));
