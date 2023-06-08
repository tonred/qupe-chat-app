/* eslint-disable react/jsx-no-constructed-context-values */
import React, {
    useCallback,
    useRef,
    Fragment,
    useContext,
    type PropsWithChildren,
    useEffect,
} from 'react'
import _isNil from 'lodash/isNil'

import { error } from '@/utils'

import { PortalManager } from './Manager'
import { createPortalContext } from './context'
import { PortalConsumer } from './Consumer'
import { DefaultEventEmitter } from './defaultEventEmitter'

type Operation =
    | { type: 'mount'; key: number; children: React.ReactNode }
    | { type: 'update'; key: number; children: React.ReactNode }
    | { type: 'unmount'; key: number }

// Events const
const addType = 'ADD_PORTAL'
const removeType = 'REMOVE_PORTAL'

const defaultRenderManagerViewFn = (children: React.ReactNode): any => (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>{children}</>
)

interface EventEmitterFunc {
    emit: (...args: any[]) => any
    addListener: (...args: any[]) => any
    removeListener: (...args: any[]) => any
}

export interface BuildPortalOptions {
    hostName?: string

    eventEmitter?: EventEmitterFunc

    renderManagerView?: (children: React.ReactNode) => React.ReactElement
}

export function buildPortal(options: BuildPortalOptions): any {
    const {
        hostName = 'default',
        eventEmitter = new DefaultEventEmitter(),
        renderManagerView = defaultRenderManagerViewFn,
    } = options
    const nextKey = 10000
    const add = (el: React.ReactNode): number => {
        const key = nextKey + 1
        eventEmitter.emit(addType, hostName, el, key)
        return key
    }

    const remove = (key: number): void => {
        eventEmitter.emit(removeType, hostName, key)
    }

    const PortalContext = createPortalContext(hostName)

    const PortalHost: React.FC<PropsWithChildren> = React.memo(props => {
        const managerRef = useRef<PortalManager>()
        const nextKeyRef = useRef<number>(0)
        const queueRef = useRef<Operation[]>([])
        const hostNameRef = useRef(hostName)
        useEffect(() => {
            hostNameRef.current = hostName
        }, [hostName])

        const mount: any = useCallback((name: string, children: React.ReactNode, _key?: number) => {
            if (name !== hostNameRef.current) {
                return
            }

            const key = _key || nextKeyRef.current + 1
            if (managerRef.current) {
                managerRef.current.mount(key, children)
            }
            else {
                queueRef.current.push({ children, key, type: 'mount' })
            }

            // eslint-disable-next-line consistent-return
            return key
        }, [])

        const update = useCallback((name: string, key: number, children: React.ReactNode) => {
            if (name !== hostNameRef.current) {
                return
            }

            if (managerRef.current) {
                managerRef.current.update(key, children)
            }
            else {
                const op: Operation = { children, key, type: 'mount' }
                const index = queueRef.current.findIndex(
                    o => o.type === 'mount' || (o.type === 'update' && o.key === key),
                )

                if (index > -1) {
                    queueRef.current[index] = op
                }
                else {
                    queueRef.current.push(op)
                }
            }
        }, [])

        const unmount = useCallback((name: string, key: number) => {
            if (name !== hostNameRef.current) {
                return
            }

            if (managerRef.current) {
                managerRef.current.unmount(key)
            }
            else {
                queueRef.current.push({ key, type: 'unmount' })
            }
        }, [])

        useEffect(() => {
            eventEmitter.addListener(addType, mount)
            eventEmitter.addListener(removeType, unmount)

            return () => {
                eventEmitter.removeListener(addType, mount)
                eventEmitter.removeListener(removeType, unmount)
            }
        }, [mount, unmount])

        useEffect(() => {
            const queue = queueRef.current
            const manager = managerRef.current

            while (queue.length && manager) {
                const action = queue.pop()
                if (action) {
                    switch (action.type) {
                        case 'mount':
                            manager.mount(action.key, action.children)
                            break
                        case 'update':
                            manager.update(action.key, action.children)
                            break
                        case 'unmount':
                            manager.unmount(action.key)
                            break
                        default:
                            break
                    }
                }
            }
        }, [])

        return (
            <PortalContext.Provider
                value={{
                    mount,
                    unmount,
                    update,
                }}
            >
                {props.children}
                <PortalManager ref={managerRef as any} renderManagerView={renderManagerView} />
            </PortalContext.Provider>
        )
    })
    PortalHost.displayName = `PortalHost-${hostName}`

    const PortalRender: React.FC<PropsWithChildren> = React.memo(props => {
        const manager = useContext(PortalContext)

        if (_isNil(manager)) {
            error('Not find PortalContext')
            return null
        }

        return (
            <PortalConsumer hostName={hostName} manager={manager}>
                {props.children}
            </PortalConsumer>
        )
    })
    PortalRender.displayName = `PortalRender-${hostName}`

    return {
        add,
        PortalHost,
        PortalRender,
        remove,
    }
}
