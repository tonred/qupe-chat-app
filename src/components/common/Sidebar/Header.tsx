import React, { useCallback } from 'react'
import { type MenuProps } from 'antd'
import _compact from 'lodash/compact'
import { type ChatServer } from 'qupe-lib/dist/chat/server'

import { SectionHeader } from '@/components/common/SectionHeader'
import { closeModal, openModal } from '@/components/common/Modal'
import { ServerDetail } from '@/components/common/modals/ServerDetail'

interface ServerHeaderProps {
    chatServer?: ChatServer
}

export const ServerHeader: React.FC<ServerHeaderProps> = React.memo<ServerHeaderProps>(props => {
    const { chatServer } = props
    const showGroupDetail = true

    if (!chatServer) {
        return null
    }

    const handleShowGroupDetail = useCallback(() => {
        const key = openModal(
            <ServerDetail
                serverId={chatServer.id!}
                onClose={() => {
                    closeModal(key)
                }}
            />,
        )
    }, [chatServer])

    const menu: MenuProps = {
        items: _compact([
            showGroupDetail && {
                key: '0',
                label: 'View Details',
                onClick: handleShowGroupDetail,
            },
        ] as MenuProps['items']),
    }

    return <SectionHeader menu={menu}>{chatServer.info()?.meta.title}</SectionHeader>
})
ServerHeader.displayName = 'ServerHeader'
