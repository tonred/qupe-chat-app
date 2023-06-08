import React, { type PropsWithChildren } from 'react'

const Wrapper = React.memo<PropsWithChildren>(props => (
    <div className="flex relative w-full overflow-auto">
        <div className="w-full h-full flex" style={{ minWidth: 0 }}>
            <div className="flex flex-col overflow-hidden flex-1">{props.children}</div>
        </div>
    </div>
))

Wrapper.displayName = 'Wrapper'
export default Wrapper
