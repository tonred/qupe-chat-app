import { type DependencyList, useLayoutEffect } from 'react'

import { useMemoizedFn } from './useMemoizedFn'

export function useWatch(deps: DependencyList, cb: () => void): void {
    const memoizedFn = useMemoizedFn(cb)
    useLayoutEffect(() => {
        memoizedFn()
    }, deps)
}
