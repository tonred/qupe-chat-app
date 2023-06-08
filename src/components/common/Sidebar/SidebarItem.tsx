import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { Typography, Badge } from 'antd'
import clsx from 'clsx'

import { Avatar } from '@/components/common/Avatar'

interface SidebarItemProps {
    id: string
    name: string
    to: string
    badge?: boolean | number
    icon?: string | React.ReactElement
    action?: React.ReactNode
}

export const SidebarItem: React.FC<SidebarItemProps> = React.memo(props => {
    const {
        id, icon, name, to, badge,
    } = props
    const { roomId = undefined } = useParams<{
        roomId?: string
    }>()
    const isActive = typeof to === 'string' && roomId === id
    return (
        <Link to={to}>
            <div
                className={clsx(
                    'w-full hover:bg-black hover:bg-opacity-20 dark:hover:bg-white dark:hover:bg-opacity-20 cursor-pointer text-gray-900 dark:text-white rounded px-1 h-8 flex items-center text-base group mb-0.5',
                    {
                        'bg-black bg-opacity-20 dark:bg-white dark:bg-opacity-20': isActive,
                    },
                )}
            >
                {/* <div className="flex h-8 items-center justify-center text-2xl w-8 mr-3"> */}
                <div className="flex items-center justify-center px-1 mr-1">
                    {React.isValidElement(icon) ? icon : <Avatar src={icon} name={name} />}
                </div>

                <Typography.Text className="flex-1 text-gray-900 dark:text-white" ellipsis>
                    {name}
                </Typography.Text>

                {badge === true ? <Badge status="error" /> : <Badge count={Number(badge) || 0} />}

                <div className="text-base p-1 cursor-pointer hidden opacity-70 group-hover:block hover:opacity-100">
                    {props.action}
                </div>
            </div>
        </Link>
    )
})
SidebarItem.displayName = 'SidebarItem'
