import React from 'react'

import { type PortalMethods } from './context'

export type PortalConsumerProps = {
    hostName: string
    manager: PortalMethods
    children: React.ReactNode
}

export class PortalConsumer extends React.Component<PortalConsumerProps> {

    _key: any

    componentDidMount(): void {
        const { manager, hostName, children } = this.props
        if (!manager) {
            throw new Error(
                'Looks like you forgot to wrap your root component with `PortalHost` component.\n',
            )
        }

        this._key = manager.mount(hostName, children)
    }

    componentDidUpdate(): void {
        const { manager, hostName, children } = this.props
        manager.update(hostName, this._key, children)
    }

    componentWillUnmount(): void {
        const { manager, hostName } = this.props
        manager.unmount(hostName, this._key)
    }

    render(): null {
        return null
    }

}
