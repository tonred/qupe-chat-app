import React, { type PropsWithChildren, useCallback } from 'react'
import _isNil from 'lodash/isNil'
import clsx from 'clsx'
import { type EventTypes, useDrag, type UserDragConfig } from '@use-gesture/react'
import { type ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types'

import { useIsMobile } from '@/hooks/useIsMobile'
import { useSidebarContext } from '@/components/common/Sidebar/SidebarContext'
import { useWatch } from '@/hooks/useWatch'

interface PageContentRootProps extends PropsWithChildren<ReactDOMAttributes> {
    className?: string
    style?: React.CSSProperties
}

// eslint-disable-next-line react/function-component-definition
const PageContentRoot: React.FC<PageContentRootProps> = ({
    className,
    style,
    children,
    ...others
}) => (
    <div
        {...others}
        style={style}
        className={clsx('flex flex-row flex-1 overflow-hidden relative', className)}
    >
        {children}
    </div>
)

const PageGestureWrapper: React.FC<PropsWithChildren> = React.memo(props => {
    const { setShowSidebar } = useSidebarContext()

    const bind = useDrag<EventTypes['drag'], UserDragConfig>(
        state => {
            const { swipe } = state
            const swipeX = swipe[0]
            if (swipeX > 0) {
                setShowSidebar(true)
            }
            else if (swipeX < 0) {
                setShowSidebar(false)
            }
        },
        {
            axis: 'x',
            swipe: {
                distance: 5,
            },
        },
    )

    return (
        <PageContentRoot
            style={{
                touchAction: 'pan-x',
            }}
            {...bind()}
        >
            {props.children}
        </PageContentRoot>
    )
})
PageGestureWrapper.displayName = 'PageGestureWrapper'

interface PageContentProps {
    'sidebar'?: React.ReactNode
    'data-tc-role'?: string
}

export const PageContent: React.FC<PropsWithChildren<PageContentProps>> = React.memo(props => {
    const { sidebar, children } = props
    const { showSidebar, setShowSidebar } = useSidebarContext()
    const isMobile = useIsMobile()
    const handleHideSidebar = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation()
        e.preventDefault()
        setShowSidebar(false)
    }, [])

    useWatch([isMobile], () => {
        if (!isMobile) {
            setShowSidebar(true)
        }
    })

    const sidebarEl = _isNil(sidebar) ? null : (
        <div
            className={clsx(
                'bg-sidebar-light dark:bg-sidebar-dark flex-shrink-0 transition-width w-60',
            )}
        >
            {props.sidebar}
        </div>
    )

    const showMask = isMobile && showSidebar && !_isNil(sidebarEl)

    const contentMaskEl = showMask ? (
        <div
            className="absolute right-0 top-0 bottom-0 z-10"
            style={{ width: 'calc(100% - 15rem)' }} // 15rem is "w-60" which sidebar with
            onClick={handleHideSidebar}
        />
    ) : null

    const contentEl = children

    const el = (
        <>
            {sidebarEl}

            {contentMaskEl}

            <div
                className={clsx(
                    'flex flex-auto bg-content-light dark:bg-content-dark overflow-hidden',
                    isMobile && 'transform left-0 w-full h-full absolute transition-transform',
                    isMobile && {
                        'translate-x-0': !showSidebar,
                        'translate-x-60': showSidebar,
                    },
                )}
                data-tc-role={props['data-tc-role']}
            >
                <div className="tc-content-background" />

                <div
                    className={clsx('flex relative w-full', {
                        'overflow-auto': !showMask,
                        'overflow-hidden': showMask,
                    })}
                >
                    {contentEl}
                </div>
            </div>
        </>
    )

    if (isMobile) {
        return <PageGestureWrapper>{el}</PageGestureWrapper>
    }
    return <PageContentRoot>{el}</PageContentRoot>
})
PageContent.displayName = 'PageContent'
