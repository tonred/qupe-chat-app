import React, { type PropsWithChildren, Suspense } from 'react'
import {
    BrowserRouter, Route, Routes, Navigate,
} from 'react-router-dom'
import clsx from 'clsx'
import { ConfigProvider as AntdProvider } from 'antd'
import { Helmet } from 'react-helmet'

import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { AppRouterApi } from '@/components/common/AppRouterApi'
import { getPopupContainer, preventDefault } from '@/utils/dom-helper'
// import { Loadable } from '@/components/common/Loadable'
import { RootContextProvider } from '@/context/RootContext'
import { PortalHost } from '@/components/common/Portal'
import { UserContextProvider } from '@/context/UserContext'
import MainRoute from '@/routes/Main'

// const MainRoute = Loadable(() => import('./routes/Main'))

const AppProvider: React.FC<PropsWithChildren> = React.memo(props => (
    <Suspense fallback={<LoadingSpinner />}>
        <RootContextProvider>
            <BrowserRouter>
                <AntdProvider getPopupContainer={getPopupContainer}>
                    <UserContextProvider>{props.children}</UserContextProvider>
                </AntdProvider>
            </BrowserRouter>
        </RootContextProvider>
    </Suspense>
))
AppProvider.displayName = 'AppProvider'

const AppContainer: React.FC<PropsWithChildren> = React.memo(props => (
    <div
        id="app"
        className={clsx('app', 'absolute inset-0 select-none overflow-hidden', {
            dark: true,
        })}
        onContextMenu={preventDefault}
    >
        {props.children}
    </div>
))
AppContainer.displayName = 'AppContainer'

const AppHeader: React.FC = React.memo(() => {
    const serverName = 'Qupe – Chat'
    const language = 'en'

    return (
        <Helmet>
            <meta httpEquiv="Content-Language" content={language} />
            <title>{serverName}</title>
        </Helmet>
    )
})
AppHeader.displayName = 'AppHeader'

export const App: React.FC = React.memo(() => (
    <AppProvider>
        <AppHeader />
        <AppContainer>
            <AppRouterApi />
            <PortalHost>
                <Routes>
                    <Route path="/main/*" element={<MainRoute />} />

                    <Route path="/*" element={<Navigate to="/main" replace />} />
                </Routes>
            </PortalHost>
        </AppContainer>
    </AppProvider>
))
App.displayName = 'App'
