import React, { useCallback } from 'react'
import { EllipsisOutlined } from '@ant-design/icons'

import { closeModal, openModal } from '@/components/common/Modal'
import { SettingsView } from '@/components/common/modals/SettingsView'

export const SettingBtn: React.FC = React.memo(() => {
    const handleClick = useCallback(() => {
        const key = openModal(<SettingsView onClose={() => closeModal(key)} />)
    }, [])

    return (
        <EllipsisOutlined
            className="h-16 w-full text-3xl text-gray-600 dark:text-white focus:outline-none"
            onClick={handleClick}
        />
    )
})
SettingBtn.displayName = 'SettingBtn'
