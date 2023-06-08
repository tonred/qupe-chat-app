import React, { useCallback } from 'react'
import { UserPermissions } from 'qupe-lib/dist/permissions'

import { PermissionItem } from './PermissionItem'

interface PermissionsListProps {
    disabled: boolean
    permissions?: UserPermissions
    onChange: (p: UserPermissions) => void
}

export const PermissionsList: React.FC<PermissionsListProps> = React.memo<PermissionsListProps>(
    props => {
        const {
            permissions = new UserPermissions([false, false, false, false, false]),
            disabled,
            onChange,
        } = props
        const handleChange = useCallback(() => {
            const p = new UserPermissions([...permissions.values])
            onChange(p)
        }, [permissions])

        return (
            <div className="dark flex flex-col">
                <PermissionItem
                    title="Admin"
                    desc="Edit permissions, withdraw tokens"
                    checked={permissions.isAdmin}
                    disabled={disabled}
                    onChange={v => {
                        permissions.isAdmin = v
                        handleChange()
                    }}
                />
                <PermissionItem
                    title="Modify configuration"
                    desc="Allow user to change server configuration"
                    checked={permissions.canChangeConfig}
                    disabled={disabled}
                    onChange={v => {
                        permissions.canChangeConfig = v
                        handleChange()
                    }}
                />
                <PermissionItem
                    title="Ban/Unban"
                    desc="Allow user to ban/unban other users"
                    checked={permissions.canBan}
                    disabled={disabled}
                    onChange={v => {
                        permissions.canBan = v
                        handleChange()
                    }}
                />
                <PermissionItem
                    title="Create new rooms"
                    desc="Allow user to create new rooms on server"
                    checked={permissions.canCreateRoom}
                    disabled={disabled}
                    onChange={v => {
                        permissions.canCreateRoom = v
                        handleChange()
                    }}
                />
                <PermissionItem
                    title="Send message"
                    desc="Allow user to send messages in rooms"
                    checked={permissions.canSendMessage}
                    disabled={disabled}
                    onChange={v => {
                        permissions.canSendMessage = v
                        handleChange()
                    }}
                />
            </div>
        )
    },
)
PermissionsList.displayName = 'PermissionsList'
