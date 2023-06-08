import React, { useCallback, useState } from 'react'
import { Button, Divider } from 'antd'
import { type ChatProfileMeta } from 'qupe-lib/dist/chat/schema'

import { Avatar } from '@/components/common/Avatar'
import {
    DefaultFullModalInputEditorRender,
    FullModalField,
} from '@/components/common/FullModal/Field'
import { useUserContext } from '@/context/UserContext'
import { useWallet } from '@/stores/WalletService'
import { closeModal } from '@/components/common/Modal'

export const SettingsAccount: React.FC = React.memo(() => {
    const [loading, setLoading] = useState(false)
    const wallet = useWallet()
    const { userState, disconnect, update } = useUserContext()
    const { profile } = userState
    if (!profile) {
        return null
    }
    const { meta: userInfo } = profile
    const [changedUsername, setChangedUsername] = useState<string | undefined>(undefined)

    const onSaved = useCallback(() => {
        update().then(() => {
            setChangedUsername(undefined)
            setLoading(false)
        })
    }, [update])
    const handleUpdateUsername = useCallback(async (newValue?: string) => {
        setChangedUsername(newValue)
    }, [])

    const handleSave = useCallback(async () => {
        if (!profile) return
        setLoading(true)
        const newMeta = {
            ...profile.meta,
            displayName: changedUsername,
        } as ChatProfileMeta
        profile.editMeta(newMeta, onSaved).catch(() => setLoading(false))
    }, [changedUsername, userInfo, userState, onSaved])

    const handleLogout = useCallback(async () => {
        disconnect()
        wallet.disconnect()
        closeModal()
    }, [wallet, disconnect])

    return (
        <div>
            <div className="flex flex-wrap">
                <div className="w-1/3 mobile:w-full">
                    {/* <AvatarUploader */}
                    {/*    className="text-4xl" */}
                    {/*    circle */}
                    {/*    onUploadSuccess={handleUserAvatarChange} */}
                    {/* > */}
                    <Avatar size={128} src="asd" name={changedUsername ?? userInfo?.displayName} />
                    {/* </AvatarUploader> */}
                </div>
                <div className="w-2/3 mobile:w-full">
                    <FullModalField
                        title="Username"
                        value={changedUsername ?? userInfo?.displayName}
                        editable
                        renderEditor={DefaultFullModalInputEditorRender}
                        onSave={handleUpdateUsername}
                    />
                    <FullModalField
                        title="Address"
                        value={userState.profile?.owner?.toString()}
                    />
                    <FullModalField
                        title="Profile contract address"
                        value={userState.profile?.address.toString()}
                    />
                </div>
            </div>
            {changedUsername && (
                <div className="w-full flex justify-center">
                    <Button type="primary" onClick={handleSave} loading={loading}>
                        Save
                    </Button>
                </div>
            )}
            <Divider />

            <div>
                <Button type="primary" danger onClick={handleLogout}>
                    Logout
                </Button>
            </div>
        </div>
    )
})
SettingsAccount.displayName = 'SettingsAccount'
