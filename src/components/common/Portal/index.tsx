import React from 'react'

import { buildPortal } from './buildPortal'
import { DefaultEventEmitter } from './defaultEventEmitter'

const eventEmitter = new DefaultEventEmitter()

const {
    PortalHost, PortalRender, add, remove,
} = buildPortal({
    eventEmitter,
    hostName: 'default',
    renderManagerView: children => <div className="z-10">{children}</div>,
})

export {
    PortalHost, PortalRender, add as PortalAdd, remove as PortalRemove,
}
