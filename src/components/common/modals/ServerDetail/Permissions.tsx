import React, { useCallback, useMemo, useState } from 'react'
import { type ChatServer } from 'qupe-lib/dist/chat/server'
import { UserPermissions } from 'qupe-lib/dist/permissions'
import {
    Button, Divider, Input, Space,
} from 'antd'
import { isEqual } from 'lodash'
import { PermissionsManager } from 'qupe-lib/dist/permissionsManager'
import { Address } from 'everscale-inpage-provider'

import { FullModalCommonTitle } from '@/components/common/FullModal/CommonTitle'
import { useUserContext } from '@/context/UserContext'
import { PermissionsList } from '@/components/common/modals/ServerDetail/PermissionsList'
import { useRootContext } from '@/context/RootContext'
import { error, isValidAddress } from '@/utils'

interface ServerPermissionsProps {
    server: ChatServer
    update: () => Promise<void>
}

export const ServerPermissions: React.FC<ServerPermissionsProps> = React.memo<ServerPermissionsProps>(props => {
    const chatServer = props.server
    const { root } = useRootContext()
    if (!chatServer) {
        return null
    }
    const { userState } = useUserContext()
    const [loading, setLoading] = useState(false)

    const [userAddress, setUserAddress] = useState('')
    const [userPermissions, setUserPermissions] = useState<UserPermissions | undefined>(
        undefined,
    )
    const [changedUserPermissions, setChangedUserPermissions] = useState<
        UserPermissions | undefined
    >(undefined)

    const disabled = useMemo(() => {
        if (!chatServer || !userState.profile) return true
        return !PermissionsManager.isAdmin({
            entity: chatServer,
            profile: userState.profile,
        })
    }, [chatServer, userState.profile])
    const { defaultPermissions } = chatServer
    const [changedPermissions, setChangedPermissions] = useState(
        new UserPermissions([...defaultPermissions.values]),
    )
    const onSave = useMemo(
        () => () => {
            props.update().then(() => setLoading(false))
        },
        [],
    )
    const handleFindUser = useCallback(() => {
        if (!userAddress || !root || !chatServer || !isValidAddress(userAddress)) return
        setUserPermissions(undefined)
        try {
            const address = new Address(userAddress)
            // @ts-ignore
            root.getProfile(address)
                .then(p => {
                    const up = p.permissions.get(chatServer.address.toString())
                    if (up) {
                        setUserPermissions(new UserPermissions([...up.values]))
                        setChangedUserPermissions(new UserPermissions([...up.values]))
                    }
                })
                .catch()
        }
        catch (e) {
            error(e)
        }
    }, [userAddress, chatServer, root])

    const handleSavePermissions = useCallback(() => {
        if (!userState.profile) return
        setLoading(true)
        userState.profile
            .setDefaultPermissions(changedPermissions, chatServer.address, onSave)
            .catch(() => {
                setLoading(false)
            })
    }, [userState.profile, changedPermissions])

    const handleSaveUserPermissions = useCallback(() => {
        if (!userState.profile || !userAddress || !isValidAddress(userAddress)) return
        setLoading(true)

        userState.profile
            // @ts-ignore
            .setUserPermissions(changedUserPermissions, chatServer.address, new Address(userAddress), onSave)
            .catch(() => {
                setLoading(false)
            })
    }, [userState.profile, changedUserPermissions])
    return (
        <div>
            <FullModalCommonTitle>Default server permissions</FullModalCommonTitle>
            <div className="mb-2 space-x-2 text-right">
                <Button
                    type="primary"
                    loading={loading}
                    disabled={
                        disabled
                        || isEqual(changedPermissions.values, defaultPermissions.values)
                    }
                    onClick={handleSavePermissions}
                >
                    Save
                </Button>
            </div>
            <PermissionsList
                disabled={disabled}
                permissions={changedPermissions}
                onChange={setChangedPermissions}
            />

            <Divider />
            <FullModalCommonTitle>User server permissions</FullModalCommonTitle>
            <div>
                <Space.Compact style={{ height: '35px', width: '100%' }}>
                    <Input
                        className="w-full shadow-none border-1 placeholder:text-gray-400"
                        maxLength={67}
                        placeholder="User address"
                        value={userAddress}
                        type="text"
                        onChange={e => setUserAddress(e.target.value)}
                    />
                    <Button
                        type="primary"
                        style={{ height: '35px' }}
                        onClick={handleFindUser}
                    >
                        Find user
                    </Button>
                </Space.Compact>
            </div>
            {userPermissions && (
                <>
                    <div className="mb-2 py-5 space-x-2 text-right">
                        <Button
                            type="primary"
                            loading={loading}
                            disabled={
                                disabled
                                || (!changedUserPermissions || !userPermissions)
                                || isEqual(changedUserPermissions.values, userPermissions.values)
                            }
                            onClick={handleSaveUserPermissions}
                        >
                            Save
                        </Button>
                    </div>
                    <PermissionsList
                        disabled={disabled}
                        permissions={changedUserPermissions}
                        onChange={setChangedUserPermissions}
                    />
                </>
            )}
        </div>
    )
})
ServerPermissions.displayName = 'ServerPermissions'
