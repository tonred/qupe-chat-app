/* eslint-disable react/jsx-no-constructed-context-values */
import React, {
    useContext, useState, useCallback, type PropsWithChildren,
} from 'react'
import _noop from 'lodash/noop'

interface SidebarContextProps {
    showSidebar: boolean
    switchSidebar: () => void
    setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarContext = React.createContext<SidebarContextProps>({
    setShowSidebar: _noop,
    showSidebar: true,
    switchSidebar: _noop,
})
SidebarContext.displayName = 'SidebarContext'

export const SidebarContextProvider: React.FC<PropsWithChildren> = React.memo(props => {
    const [showSidebar, setShowSidebar] = useState(true)

    // 切换
    const switchSidebar = useCallback(() => {
        setShowSidebar(!showSidebar)
    }, [showSidebar])

    return (
        <SidebarContext.Provider value={{ setShowSidebar, showSidebar, switchSidebar }}>
            {props.children}
        </SidebarContext.Provider>
    )
})
SidebarContextProvider.displayName = 'SidebarContextProvider'

export function useSidebarContext(): SidebarContextProps {
    const context = useContext(SidebarContext)

    return context
}
