import { useCallback, useEffect, useState } from 'react'
import { type Address } from 'everscale-inpage-provider'
import { type ChatProfile } from 'qupe-lib/dist/chat/profile'

import { debug } from '@/utils'
import { useRootContext } from '@/context/RootContext'

interface ChatProfileProps {
    chatProfile?: ChatProfile
    update: () => Promise<void>
    loading: boolean
}

export const useUser = (address: Address): ChatProfileProps => {
    const [chatProfile, setChatProfile] = useState<ChatProfile | undefined>()
    const { root } = useRootContext()
    const [loading, setLoading] = useState(true)
    const update = useCallback(async () => {
        if (!chatProfile) return
        debug('forceUpdate')
        await chatProfile.update()
    }, [chatProfile])

    useEffect(() => {
        if (!root) return
        setLoading(true)
        // @ts-ignore
        root.getProfile(address).then(p => {
            setLoading(false)
            setChatProfile(p)
        })
    }, [address])

    return {
        chatProfile,
        loading,
        update,
    }
}
