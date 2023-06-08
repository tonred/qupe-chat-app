import React, { useCallback, useMemo, useState } from 'react'
import { type ChatRoom } from 'qupe-lib/dist/chat/room'
import { Address } from 'everscale-inpage-provider'
import { PermissionsManager } from 'qupe-lib/dist/permissionsManager'
import { UserPermissions } from 'qupe-lib/dist/permissions'
import {
    Button, Divider, Input, Space,
} from 'antd'
import { isEqual } from 'lodash'

import { useUserContext } from '@/context/UserContext'
import { error, isValidAddress } from '@/utils'
import { useRootContext } from '@/context/RootContext'
import { FullModalCommonTitle } from '@/components/common/FullModal/CommonTitle'
import { PermissionsList } from '@/components/common/modals/ServerDetail/PermissionsList'


interface RoomPermissionsProps {
    room: ChatRoom
    update: () => Promise<void>
}

export const RoomPermissions: React.FC<RoomPermissionsProps> = React.memo<RoomPermissionsProps>(props => {
    const chatRoom = props.room
    const { root } = useRootContext()
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
        if (!userState.profile) return false
        return !PermissionsManager.isAdmin({
            entity: chatRoom,
            profile: userState.profile,
        })
    }, [chatRoom, userState.profile])
    const { defaultPermissions } = chatRoom
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
        if (!root || !userAddress || !isValidAddress(userAddress)) return
        setUserPermissions(undefined)
        try {
            const address = new Address(userAddress)
            // @ts-ignore
            root.getProfile(address)
                .then(p => {
                    const up = p.permissions.get(chatRoom.address.toString())
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
    }, [userAddress, chatRoom, root])

    const handleSavePermissions = useCallback(() => {
        if (!userState.profile) return
        setLoading(true)
        userState.profile
            .setDefaultPermissions(changedPermissions, chatRoom.address, onSave)
            .catch(() => {
                setLoading(false)
            })
    }, [userState.profile, changedPermissions])

    const handleSaveUserPermissions = useCallback(() => {
        if (!userState.profile || !userAddress || !isValidAddress(userAddress)) return
        setLoading(true)

        userState.profile
            // @ts-ignore
            .setUserPermissions(changedUserPermissions, chatRoom.address, new Address(userAddress), onSave)
            .catch(() => {
                setLoading(false)
            })
    }, [userState.profile, chatRoom, changedUserPermissions])
    return (
        <div>
            <FullModalCommonTitle>Default room permissions</FullModalCommonTitle>
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
            <FullModalCommonTitle>User room permissions</FullModalCommonTitle>
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
RoomPermissions.displayName = 'RoomPermissions'
