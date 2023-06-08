import React, { useCallback, useMemo } from 'react'

import { FullModal } from '@/components/common/FullModal'
import { SidebarView, type SidebarViewMenuType } from '@/components/common/SidebarView'

import { SettingsAccount } from './Account'

interface SettingsViewProps {
    onClose: () => void
}

export const SettingsView: React.FC<SettingsViewProps> = React.memo(props => {
    const handleChangeVisible = useCallback(
        (visible: boolean) => {
            if (!visible && typeof props.onClose === 'function') {
                props.onClose()
            }
        },
        [props.onClose],
    )

    const menu: SidebarViewMenuType[] = useMemo(() => {
        const common: SidebarViewMenuType = {
            children: [
                {
                    content: <SettingsAccount />,
                    title: 'Account',
                    type: 'item',
                },
                {
                    content: <h1>Work in progress</h1>,
                    title: 'Balances',
                    type: 'item',
                },
            ],
            title: 'Common',
            type: 'group',
        }

        return [common]
    }, [])

    return (
        <FullModal onChangeVisible={handleChangeVisible}>
            <SidebarView menu={menu} defaultContentPath="0.children.0.content" />
        </FullModal>
    )
})
SettingsView.displayName = 'SettingsView'
