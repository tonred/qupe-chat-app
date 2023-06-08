import React, { type PropsWithChildren } from 'react'

interface FullModalCommonTitleProps extends PropsWithChildren {
    extra?: React.ReactNode
}

export const FullModalCommonTitle: React.FC<FullModalCommonTitleProps> = React.memo(props => (
    <div className="text-xl font-bold mb-4 flex justify-between">
        <div>{props.children}</div>
        <div>{props.extra}</div>
    </div>
))
FullModalCommonTitle.displayName = 'FullModalCommonTitle'
