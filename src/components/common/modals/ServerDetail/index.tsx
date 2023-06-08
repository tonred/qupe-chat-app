import React, { useCallback, useMemo, useState } from 'react'
import _compact from 'lodash/compact'

import { FullModal } from '@/components/common/FullModal'
import { SidebarView, type SidebarViewMenuType } from '@/components/common/SidebarView'
import { ServerPermissions } from '@/components/common/modals/ServerDetail/Permissions'
import { useServer } from '@/hooks/useServer'
import { RoomSummary } from '@/components/common/modals/ServerDetail/RoomSummary'

import { ServerSummary } from './Summary'

interface SettingsViewProps {
    serverId: number
    onClose: () => void
}

export const ServerDetail: React.FC<SettingsViewProps> = React.memo(props => {
    const { chatServer, rooms, update } = useServer(props.serverId)
    const handleChangeVisible = useCallback(
        (visible: boolean) => {
            if (!visible && typeof props.onClose === 'function') {
                props.onClose()
            }
        },
        [props.onClose],
    )
    const [defaultPath, setDefaultPath] = useState('0')


    const menu: SidebarViewMenuType[] = useMemo(() => {
        if (!chatServer) {
            return []
        }
        const _menu: SidebarViewMenuType[] = [
            {
                children: _compact([
                    {
                        content: <ServerSummary update={update} server={chatServer} />,
                        title: 'Overview',
                        type: 'item',
                    },
                    {
                        content: <ServerPermissions update={update} server={chatServer} />,
                        title: 'Permissions',
                        type: 'item',
                    },
                    {
                        content: <h1>Work in progress</h1>,
                        title: 'Balances',
                        type: 'item',
                    },
                ]),
                title: 'Common',
                type: 'group',
            },
            {
                children: _compact(
                    rooms.map(r => ({
                        content: <RoomSummary update={update} chatServer={chatServer} room={r} />,
                        title: r.info()?.meta.title ?? `Room #${r.baseData?.roomId}`,
                        type: 'item',
                    })),
                ),
                title: 'Rooms',
                type: 'group',
            },
        ]
        if (defaultPath === '0') setDefaultPath('0.children.0.content')
        return _menu
    }, [chatServer, rooms])

    return (
        <FullModal onChangeVisible={handleChangeVisible}>
            <SidebarView menu={menu} defaultContentPath={defaultPath} />
        </FullModal>
    )
})
ServerDetail.displayName = 'ServerDetail'
