import React from 'react'
import { DownCircleOutlined } from '@ant-design/icons'

interface Props {
    onClick: () => void
}

export const ScrollToBottom: React.FC<Props> = React.memo(props => (
    <div
        className="absolute right-10 bottom-18 px-3 py-2 rounded-full bg-white dark:bg-black bg-opacity-50 shadow cursor-pointer z-10 w-11 h-11 flex justify-center items-center text-2xl hover:bg-opacity-80"
        onClick={props.onClick}
    >
        <DownCircleOutlined />
    </div>
))
ScrollToBottom.displayName = 'ScrollToBottom'
