import React, { useCallback, useMemo } from 'react'
import { Skeleton, Space, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { PermissionsManager } from 'qupe-lib/dist/permissionsManager'

import { ServerHeader } from '@/components/common/Sidebar/Header'
import { SidebarItem } from '@/components/common/Sidebar/SidebarItem'
import { useChatServerContext } from '@/context/ChatServerContext'
import { isValidStr } from '@/utils'
import { openModal } from '@/components/common/Modal'
import { ModalCreateRoom } from '@/components/common/modals/CreateRoom'
import { useUserContext } from '@/context/UserContext'
import HashIcon from '@/assets/icons/hash'

export const NewRoomSidebarItem: React.FC<{ onClick: () => void }> = React.memo(props => (
    <div
        className="'w-full hover:bg-black hover:bg-opacity-20 dark:hover:bg-white dark:hover:bg-opacity-20 cursor-pointer text-gray-700 dark:text-white rounded px-2 h-11 flex items-center text-base group mb-0.5'"
        onClick={props.onClick}
    >
        <div className="flex h-8 items-center justify-center text-2xl w-8 mr-3">
            <PlusOutlined />
        </div>

        <Typography.Text className="flex-1 text-gray-900 dark:text-white" ellipsis>
            Create new room
        </Typography.Text>

        <div className="text-base p-1 cursor-pointer hidden opacity-70 group-hover:block hover:opacity-100">
            {/* {props.action} */}
        </div>
    </div>
))
NewRoomSidebarItem.displayName = 'NewRoomSidebarItem'

const Sidebar = React.memo(() => {
    const {
        chatServer, rooms, update, loading,
    } = useChatServerContext()
    const { userState } = useUserContext()

    const canCreateRoom = useMemo(() => {
        if (!chatServer || !userState.profile) return false
        return PermissionsManager.canCreateRoom({ entity: chatServer, profile: userState.profile })
    }, [chatServer, userState.profile])

    const handleCreateRoom = useCallback(() => {
        if (!chatServer) return
        openModal(<ModalCreateRoom chatServer={chatServer} update={update} />)
    }, [chatServer])

    let roomsEl
    if (loading) {
        roomsEl = (
            <>
                <Space className="h-11">
                    <Skeleton.Avatar active size={32} shape="circle" />
                    <Skeleton.Input active />
                </Space>
                <Space className="h-11">
                    <Skeleton.Avatar active size={32} shape="circle" />
                    <Skeleton.Input active />
                </Space>
                <Space className="h-11">
                    <Skeleton.Avatar active size={32} shape="circle" />
                    <Skeleton.Input active />
                </Space>
            </>
        )
    }
    else {
        roomsEl = (
            <>
                {rooms
                    .filter(r => !isValidStr(r.info()?.meta))
                    .map(r => {
                        const { roomId } = r.baseData!
                        return (
                            <SidebarItem
                                icon={<HashIcon />}
                                key={roomId}
                                id={roomId.toString()}
                                name={r.info()?.meta.title || 'room'}
                                to={`/main/c/${chatServer!.id}/${roomId}`}
                            />
                        )
                    })}
                {canCreateRoom && <NewRoomSidebarItem onClick={handleCreateRoom} />}
            </>
        )
    }
    return (
        <div className="h-full bg-sidebar-light dark:bg-sidebar-dark flex-shrink-0 transition-width w-60 flex flex-col justify-start items-center">
            <div className="flex-1 h-full w-full overflow-hidden flex flex-col">
                <ServerHeader chatServer={chatServer} />
                <div className="p-2 space-y-1 overflow-y-hidden hover:overflow-y-smart scroll overflow-x-hidden thin-scrollbar">
                    {roomsEl}
                </div>
            </div>
        </div>
    )
})

Sidebar.displayName = 'Sidebar'

export default Sidebar
