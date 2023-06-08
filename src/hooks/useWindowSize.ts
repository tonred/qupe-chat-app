import { useEffect } from 'react'

import { isBrowser } from '@/utils'
import { useRafState } from '@/hooks/useRafState'

// Reference: https://github.com/streamich/react-use/blob/master/src/useWindowSize.ts

export const useWindowSize = (
    initialWidth = Infinity,
    initialHeight = Infinity,
): { height: number; width: number } => {
    const [state, setState] = useRafState<{ width: number; height: number }>({
        height: isBrowser ? window.innerHeight : initialHeight,
        width: isBrowser ? window.innerWidth : initialWidth,
    })

    // eslint-disable-next-line consistent-return
    useEffect((): (() => void) | void => {
        if (isBrowser) {
            const handler = (): void => {
                setState({
                    height: window.innerHeight,
                    width: window.innerWidth,
                })
            }

            window.addEventListener('resize', handler)

            return () => {
                window.removeEventListener('resize', handler)
            }
        }
    }, [])

    return state
}
