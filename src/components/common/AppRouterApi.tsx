import React from 'react'
import { type PropsWithChildren } from 'react'
import { useNavigate, type NavigateFunction } from 'react-router'

// eslint-disable-next-line import/no-mutable-exports
export let navigate: NavigateFunction = () => {
    throw new Error('route navigate not init')
}

export const AppRouterApi: React.FC<PropsWithChildren> = React.memo(() => {
    const _navigate = useNavigate()
    navigate = _navigate

    return null
})
AppRouterApi.displayName = 'AppRouterApi'
