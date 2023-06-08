import React from 'react'

export const ChatMessageHeader: React.FC<{
    title: React.ReactNode
}> = React.memo(props => (
    <div className="px-5 pb-4">
        <div className="font-extrabold mb-2 text-2xl flex items-center space-x-1">
            <div>#</div>
            <div>{props.title}</div>
        </div>
        <div className="text-base opacity-80">Chat starts here</div>
    </div>
))
ChatMessageHeader.displayName = 'ChatMessageHeader'
