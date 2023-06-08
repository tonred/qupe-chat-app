import React, { useCallback } from 'react'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'

import { useIsMobile } from '@/hooks/useIsMobile'
import { useSidebarContext } from '@/components/common/Sidebar/SidebarContext'

export const MobileMenuBtn: React.FC = React.memo(() => {
    const { showSidebar, setShowSidebar } = useSidebarContext()
    const isMobile = useIsMobile()

    const handleSwitchSidebar = useCallback(() => {
        setShowSidebar(!showSidebar)
    }, [showSidebar])

    if (!isMobile) {
        return null
    }

    return showSidebar ? (
        <MenuFoldOutlined className="text-3xl mb-6 cursor-pointer" onClick={handleSwitchSidebar} />
    ) : (
        <MenuUnfoldOutlined
            className="text-3xl mb-6 cursor-pointer"
            onClick={handleSwitchSidebar}
        />
    )
})
MobileMenuBtn.displayName = 'MobileMenuBtn'
