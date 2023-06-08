import React, { type PropsWithChildren } from 'react'
import { Space } from 'antd'

interface HeaderProps extends PropsWithChildren {
    prefix?: React.ReactNode
    suffix?: React.ReactNode
    actions?: React.ReactNode[]
}

const Header = React.memo<HeaderProps>(props => (
    <div className="h-12 relative flex items-center py-0 text-base font-bold flex-shrink-0 thin-line-bottom">
        <header className="flex-1 truncate px-4">
            <div className="flex flex-wrap text-xl justify-between">
                <div className="flex items-center">
                    <div className="text-gray-500 mr-1">{props.prefix}</div>
                    <div className="text-base">{props.children}</div>
                    <div className="ml-2">{props.suffix}</div>
                </div>
                <Space>{props.actions}</Space>
            </div>
        </header>
    </div>
))

Header.displayName = 'Header'

export default Header
