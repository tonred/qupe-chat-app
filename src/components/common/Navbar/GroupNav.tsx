import React, { useCallback, useEffect, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Skeleton } from 'antd'

import { ModalCreateGroup } from '@/components/common/modals/CreateGroup'
import { openModal } from '@/components/common/Modal'
import { type ServerInfo } from '@/types/server'
import { useUserContext } from '@/context/UserContext'
import { Avatar } from '@/components/common/Avatar'

import { NavbarNavItem } from './NavItem'

const GroupNavItem: React.FC<{ server: ServerInfo }> = React.memo(({ server }) => {
    const serverId = server._id

    return (
        <NavbarNavItem
            id={server._id}
            name={server.name}
            to={`/main/c/${serverId}/-1`}
            showPill
            // badge={['muted', 'unread'].includes(unreadState)}
            // badgeProps={{
            //     status: unreadState === 'unread' ? 'error' : 'default',
            // }}
        >
            <Avatar
                shape="square" size={48} name={server.name}
                src={server.avatar}
            />
        </NavbarNavItem>
    )
})
GroupNavItem.displayName = 'GroupNavItem'

export const GroupNav: React.FC = React.memo(() => {
    const { userState } = useUserContext()
    const [servers, setServers] = useState<ServerInfo[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const tmpServers: ServerInfo[] = []
        setLoading(true)
        userState.profile?.getServers().then(_servers => {
            _servers.forEach(s => {
                tmpServers.push({
                    _id: s.id?.toString(),
                    name: s.chatData?.info.meta.title || '',
                } as ServerInfo)
            })
            setServers(tmpServers)
            setLoading(false)
        })
    }, [userState])

    const handleCreateServer = useCallback(() => {
        openModal(<ModalCreateGroup />)
    }, [])

    if (loading) {
        return (
            <div className="space-y-2">
                <div className="w-full h-12 flex items-center justify-center overflow-hidden">
                    <Skeleton.Avatar
                        active
                        size={48}
                        className="[&>span]:bg-white [&>span]:bg-opacity-10 [&>span]:animate-pulse"
                    />
                </div>
                <div className="w-full h-12 flex items-center justify-center overflow-hidden">
                    <Skeleton.Avatar
                        active
                        size={48}
                        className="[&>span]:bg-white [&>span]:bg-opacity-10 [&>span]:animate-pulse"
                    />
                </div>
                <div className="w-full h-12 flex items-center justify-center overflow-hidden">
                    <Skeleton.Avatar
                        active
                        size={48}
                        className="[&>span]:bg-white [&>span]:bg-opacity-10 [&>span]:animate-pulse"
                    />
                </div>
            </div>
        )
    }
    return (
        <div className="space-y-2">
            {Array.isArray(servers)
                && servers.map(server => (
                    <div key={server._id}>
                        <GroupNavItem server={server} />
                    </div>
                ))}

            <NavbarNavItem className="bg-green-500" name="Add server" onClick={handleCreateServer}>
                <PlusOutlined className="text-3xl text-white" />
            </NavbarNavItem>
        </div>
    )
})
GroupNav.displayName = 'GroupNav'
