import React from 'react'
import loadable, {
    type DefaultComponent,
    type LoadableComponent,
    type OptionsWithoutResolver,
} from '@loadable/component'
import pMinDelay from 'p-min-delay'
import { message } from 'antd'
import _uniqueId from 'lodash/uniqueId'

import { debug } from '@/utils'

import { LoadingSpinner } from './LoadingSpinner'

function promiseUsage<T>(p: Promise<T>, name: string): Promise<T> {
    const start = new Date().valueOf()

    return p.then(r => {
        const end = new Date().valueOf()

        debug(`[Loadable] load ${name} usage: ${end - start}ms`)

        return r
    })
}

function promiseLoading<T>(p: Promise<T>): Promise<T> {
    const key = _uniqueId('Loadable')
    message.loading({
        content: 'Loading',
        duration: 0,
        key,
    })

    return p.then(r => {
        message.destroy(key)

        return r
    })
}

interface LoadableOptions<P> extends OptionsWithoutResolver<P> {
    componentName?: string
    showLoading?: boolean
}

export function Loadable<Props>(
    loadFn: (props: Props) => Promise<DefaultComponent<Props>>,
    options?: LoadableOptions<Props>,
): LoadableComponent<Props> {
    return loadable(
        props => {
            let p = loadFn(props)

            p = promiseUsage(p, String(options?.componentName))

            if (options?.showLoading === true) {
                p = promiseLoading(p)
            }

            return pMinDelay(p, 200, { delayRejection: false })
        },
        {
            fallback: <LoadingSpinner tip="Module is loading" />,
            ...options,
        },
    )
}
