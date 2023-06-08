import { type EffectCallback, useEffect } from 'react'

// Reference: https://github.com/streamich/react-use/blob/master/src/useEffectOnce.ts

export const useEffectOnce = (effect: EffectCallback): void => {
    useEffect(effect, [])
}
