/* eslint-disable react/no-unused-class-component-methods */
import React from 'react'

export type State = {
    portals: {
        key: number
        children: React.ReactNode
    }[]
}

interface PortalManagerProps {
    renderManagerView: (children: React.ReactNode) => React.ReactElement
}

export interface PortalManagerState {
    portals: any[]
}

/**
 * Portal host is the component which actually renders all Portals.
 */
export class PortalManager extends React.PureComponent<PortalManagerProps, PortalManagerState> {

    // eslint-disable-next-line react/state-in-constructor
    state: State = {
        portals: [],
    }

    mount = (key: number, children: React.ReactNode): void => {
        this.setState(state => ({
            portals: [...state.portals, { children, key }],
        }))
    }

    update = (key: number, children: React.ReactNode): void => {
        this.setState(state => ({
            portals: state.portals.map(item => {
                if (item.key === key) {
                    return { ...item, children }
                }
                return item
            }),
        }))
    }

    unmount = (key: number): void => {
        this.setState(state => ({
            portals: state.portals.filter(item => item.key !== key),
        }))
    }

    render(): any {
        const { renderManagerView } = this.props
        const { portals } = this.state
        return portals.map(({ key, children }) => (
            <React.Fragment key={key}>{renderManagerView(children)}</React.Fragment>
        ))
    }

}
