import React, {
    type PropsWithChildren, useEffect, useMemo, useRef, useState,
} from 'react'

import { useMemoizedFn } from '@/hooks/useMemoizedFn'

interface AutoFolderProps extends PropsWithChildren {
    maxHeight: number
    showFullText?: React.ReactNode
    backgroundColor?: string
}

export const AutoFolder: React.FC<AutoFolderProps> = React.memo(props => {
    const { showFullText = 'More', backgroundColor = 'white' } = props
    const [isShowFullBtn, setIsShowFullBtn] = useState(false)
    const [isShowFull, setIsShowFull] = useState(false)
    const contentRef = useRef<HTMLDivElement>(null)

    const maxHeight = useMemo(() => {
        if (isShowFull) {
            return 'none'
        }
        return props.maxHeight
    }, [isShowFull, props.maxHeight])

    useEffect(() => {
        if (!contentRef.current) {
            return
        }

        const observer = new window.ResizeObserver(entries => {
            if (entries[0]) {
                const { height } = entries[0].contentRect

                if (height > maxHeight) {
                    setIsShowFull(false)
                    setIsShowFullBtn(true)

                    observer.disconnect()
                }
            }
        })
        observer.observe(contentRef.current)

        // eslint-disable-next-line consistent-return
        return () => observer.disconnect()
    }, [])
    const handleClickShowFullBtn = useMemoizedFn(() => {
        setIsShowFullBtn(false)
        setIsShowFull(true)
    })

    return (
        <div
            style={{
                maxHeight,
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            <div ref={contentRef}>{props.children}</div>

            {isShowFullBtn && (
                <div
                    style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,0), ${backgroundColor})`,
                        bottom: 0,
                        cursor: 'pointer',
                        left: 0,
                        padding: '4px 0',
                        position: 'absolute',
                        right: 0,
                        textAlign: 'center',
                    }}
                    onClick={handleClickShowFullBtn}
                >
                    {showFullText}
                </div>
            )}
        </div>
    )
})
AutoFolder.displayName = 'AutoFolder'
