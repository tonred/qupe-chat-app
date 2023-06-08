import React, { type PropsWithChildren } from 'react'
import clsx from 'clsx'

interface PermanentAlertProps {
    bgColor?: string
}

const PermanentAlert = React.memo<PropsWithChildren<PermanentAlertProps>>(props => {
    const { bgColor = 'bg-indigo-400', children } = props
    return <div className={clsx('text-center', bgColor, 'text-white')}>{children}</div>
})

PermanentAlert.displayName = 'PermanentAlert'

export default PermanentAlert
