import React, { useCallback, useMemo, useState } from 'react'
import { type ChatServer } from 'qupe-lib/dist/chat/server'
import { Button } from 'antd'
import { type ChatServerMeta } from 'qupe-lib/dist/chat/schema'
import { PermissionsManager } from 'qupe-lib/dist/permissionsManager'

import { FullModalCommonTitle } from '@/components/common/FullModal/CommonTitle'
import {
    DefaultFullModalInputEditorRender,
    DefaultFullModalTextAreaEditorRender,
    FullModalField,
} from '@/components/common/FullModal/Field'
import { Avatar } from '@/components/common/Avatar'
import { useUserContext } from '@/context/UserContext'

interface ServerSummaryProps {
    server: ChatServer
    update: () => Promise<void>
}

export const ServerSummary: React.FC<ServerSummaryProps> = React.memo<ServerSummaryProps>(props => {
    const [changedName, setChangedName] = useState<string | undefined>(undefined)
    const [changedDescription, setChangedDescription] = useState<string | undefined>(undefined)
    const [loading, setLoading] = useState(false)
    const { userState } = useUserContext()

    const handleUpdateName = useCallback(async (newValue?: string) => {
        setChangedName(newValue)
    }, [])
    const handleUpdateDescription = useCallback(async (newValue?: string) => {
        setChangedDescription(newValue)
    }, [])
    const chatServer = props.server

    if (!chatServer) {
        return null
    }
    const canEdit = useMemo(() => {
        if (!chatServer || !userState.profile) return false
        return PermissionsManager.canChangeConfig({
            entity: chatServer,
            profile: userState.profile,
        })
    }, [chatServer, userState.profile])

    const meta = chatServer.info()?.meta
    const serverName = meta?.title
    const description = meta?.description
    const avatar = meta?.avatar

    const onSaved = useCallback(() => {
        props.update().then(() => {
            setChangedName(undefined)
            setChangedDescription(undefined)
            setLoading(false)
        })
    }, [props.update])

    const handleSave = useCallback(async () => {
        if (!chatServer || !userState.profile) return
        setLoading(true)
        const newMeta = {
            ...meta,
            description: changedDescription ?? description,
            title: changedName ?? serverName,
        } as ChatServerMeta
        userState.profile
            .editServerMeta(newMeta, chatServer, onSaved)
            .catch(() => setLoading(false))
    }, [changedName, serverName, changedDescription, description, chatServer, userState.profile, onSaved])

    return (
        <div>
            <FullModalCommonTitle>Server overview</FullModalCommonTitle>

            <div className="flex flex-wrap">
                <div className="w-1/3 mobile:w-full">
                    <Avatar size={128} name={serverName} src={avatar} />
                    {/* <AvatarUploader */}
                    {/*    className="text-4xl" */}
                    {/*    circle */}
                    {/*    onUploadSuccess={handleGroupAvatarChange} */}
                    {/* > */}
                    {/* </AvatarUploader> */}
                </div>

                <div className="w-2/3 mobile:w-full">
                    <FullModalField
                        title="ID"
                        value={chatServer.id?.toString()}
                    />
                    <FullModalField
                        title="Address"
                        value={chatServer.address.toString()}
                    />
                    <FullModalField
                        title="Server name"
                        value={changedName ?? serverName}
                        editable={canEdit}
                        renderEditor={DefaultFullModalInputEditorRender}
                        onSave={handleUpdateName}
                    />
                    <FullModalField
                        widthFull={!!description}
                        title="Description"
                        value={changedDescription ?? description}
                        editable={canEdit}
                        renderEditor={DefaultFullModalTextAreaEditorRender}
                        onSave={handleUpdateDescription}
                    />
                </div>
            </div>
            {(changedName || changedDescription) && (
                <div className="w-full flex justify-center">
                    <Button type="primary" onClick={handleSave} loading={loading}>
                        Save
                    </Button>
                </div>
            )}
        </div>
    )
})
ServerSummary.displayName = 'ServerSummary'
