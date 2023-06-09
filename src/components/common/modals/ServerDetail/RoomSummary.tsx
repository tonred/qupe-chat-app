import React, { useCallback, useMemo, useState } from 'react'
import { Button } from 'antd'
import { type ChatRoom } from 'qupe-lib/dist/chat/room'
import { type ChatRoomMeta } from 'qupe-lib/dist/chat/schema'
import { type ChatServer } from 'qupe-lib/dist/chat/server'
import { PermissionsManager } from 'qupe-lib/dist/permissionsManager'

import { FullModalCommonTitle } from '@/components/common/FullModal/CommonTitle'
import {
    DefaultFullModalInputEditorRender,
    FullModalField,
} from '@/components/common/FullModal/Field'
import { Avatar } from '@/components/common/Avatar'
import { useUserContext } from '@/context/UserContext'
import { useRoom } from '@/hooks/useRoom'
import { PillTabPane, PillTabs } from '@/components/common/PillTabs'

import { PaidMessages } from './RoomPaidMessages'
import { RoomPermissions } from './RoomPermissions'

interface RoomSummaryProps {
    chatServer?: ChatServer
    room: ChatRoom
    update: () => Promise<void>
}

export const RoomSummary: React.FC<RoomSummaryProps> = React.memo<RoomSummaryProps>(props => {
    const { chatServer, update: serverUpdate } = props
    const { chatRoom, update } = useRoom(chatServer!, props.room.baseData!.roomId!)
    const [changedName, setChangedName] = useState<string | undefined>(undefined)
    const [loading, setLoading] = useState(false)
    const { userState } = useUserContext()
    const handleUpdateName = useCallback(async (newValue?: string) => {
        setChangedName(newValue)
    }, [])

    const canEdit = useMemo(() => {
        if (!chatRoom || !userState.profile) return false
        return PermissionsManager.canChangeConfig({ entity: chatRoom, profile: userState.profile })
    }, [chatRoom, userState.profile])

    const onSaved = useCallback(() => {
        update().then(() => {
            setChangedName(undefined)
            serverUpdate().then(() => setLoading(false))
        })
    }, [update])
    const roomTitle = chatRoom?.info()?.meta.title

    const handleSave = useCallback(async () => {
        if (!chatRoom || !userState.profile) return
        setLoading(true)
        const newMeta = {
            ...chatRoom.info()?.meta,
            title: changedName ?? roomTitle,
        } as ChatRoomMeta
        userState.profile.editRoomMeta(newMeta, chatRoom, onSaved).catch(() => setLoading(false))
    }, [changedName, chatRoom, userState.profile, onSaved])

    // const description = chatServer.info()?.meta.description
    const avatar = undefined
    if (!chatRoom) {
        return null
    }
    return (
        <div className="flex-1 overflow-y-auto">
            <PillTabs defaultActiveKey="summary">
                <PillTabPane
                    key="summary"
                    tab="Summary"
                >
                    <FullModalCommonTitle>Room overview</FullModalCommonTitle>

                    <div className="flex">
                        <div className="w-1/3">
                            <Avatar size={128} name={roomTitle} src={avatar} />
                            {/* <AvatarUploader */}
                            {/*    className="text-4xl" */}
                            {/*    circle */}
                            {/*    onUploadSuccess={handleGroupAvatarChange} */}
                            {/* > */}
                            {/* </AvatarUploader> */}
                        </div>

                        <div className="w-2/3">
                            <FullModalField
                                title="ID"
                                value={chatRoom?.baseData?.roomId.toString()}
                            />
                            <FullModalField
                                title="Address"
                                value={chatRoom?.address.toString()}
                            />
                            <FullModalField
                                title="Room title"
                                value={changedName ?? roomTitle}
                                editable={canEdit}
                                renderEditor={DefaultFullModalInputEditorRender}
                                onSave={handleUpdateName}
                            />
                        </div>
                    </div>
                    {changedName && (
                        <div className="w-full flex justify-center">
                            <Button type="primary" onClick={handleSave} loading={loading}>
                                Save
                            </Button>
                        </div>
                    )}
                </PillTabPane>
                <PillTabPane
                    key="permissions"
                    tab="Permissions"
                >
                    <RoomPermissions room={chatRoom} update={update} />
                </PillTabPane>
                <PillTabPane
                    key="balances"
                    tab="Paid messages"
                >
                    <PaidMessages room={chatRoom} update={update} />
                </PillTabPane>
            </PillTabs>
        </div>

    )
})
RoomSummary.displayName = 'RoomSummary'
