import { useMemo, useRef } from 'react'

// From https://github.com/alibaba/hooks/blob/master/packages/hooks/src/useMemoizedFn/index.ts

type Noop = (this: any, ...args: any[]) => any

type PickFunction<T extends Noop> = (
    this: ThisParameterType<T>,
    ...args: Parameters<T>
) => ReturnType<T>

export function useMemoizedFn<T extends Noop>(fn: T): T {
    const fnRef = useRef<T>(fn)

    // why not write `fnRef.current = fn`?
    // https://github.com/alibaba/hooks/issues/728
    fnRef.current = useMemo(() => fn, [fn])

    const memoizedFn = useRef<PickFunction<T>>()
    if (!memoizedFn.current) {
        memoizedFn.current = function a(this, ...args) {
            return fnRef.current.apply(this, args)
        }
    }

    return memoizedFn.current as T
}
