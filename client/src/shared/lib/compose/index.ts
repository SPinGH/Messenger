export const compose = <R>(fn1: (args: R) => R, ...fns: Array<(args: R) => R>) =>
    fns.reduce((prevFn, nextFn) => (value) => prevFn(nextFn(value)), fn1);
