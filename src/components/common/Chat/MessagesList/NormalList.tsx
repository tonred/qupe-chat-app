import React, {
    useCallback, useEffect, useRef, useState,
} from 'react'

import { useMemoizedFn } from '@/hooks/useMemoizedFn'
import { type ChatMessage } from '@/components/common/Chat/types'
import { MessageItemRow } from '@/components/common/Chat/Message'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

import { ScrollToBottom } from './ScrollToBottom'
import { ChatMessageHeader } from './ChatMessageHeader'

export interface MessageListProps {
    messages: ChatMessage[]
    title?: React.ReactNode
    isLoadingMore: boolean
    hasMoreMessage: boolean
    onLoadMore?: () => void
}

const topTriggerBuffer = 100
const bottomTriggerBuffer = 40

export const NormalMessageList: React.FC<MessageListProps> = React.memo(props => {
    const containerRef = useRef<HTMLDivElement>(null)
    const lockRef = useRef(false)
    const offsetRef = useRef(0)
    const [showScrollToBottom, setShowScrollToBottom] = useState(false)

    const scrollToBottom = useMemoizedFn(() => {
        containerRef.current?.scrollTo({ behavior: 'smooth', top: 0 })
    })

    useEffect(() => {
        if (props.messages.length === 0) {
            return
        }

        if (offsetRef.current !== 0) {
            containerRef.current?.scrollTo({ behavior: 'auto', top: offsetRef.current })
        }

        if (!lockRef.current) {
            scrollToBottom()
        }
    }, [props.messages.length])


    const handleScroll = useCallback(() => {
        if (props.messages.length === 0) {
            return
        }

        if (!containerRef.current) {
            return
        }

        offsetRef.current = containerRef.current.scrollTop

        if (-containerRef.current.scrollTop <= bottomTriggerBuffer) {
            lockRef.current = false
            setShowScrollToBottom(false)
        }
        else if (
            -containerRef.current.scrollTop + containerRef.current.clientHeight
            >= containerRef.current.scrollHeight - topTriggerBuffer
        ) {
            if (props.onLoadMore && !props.isLoadingMore) props.onLoadMore()
        }
        else {
            lockRef.current = true
            setShowScrollToBottom(true)
        }
    }, [props.messages])

    return (
        <div
            className="flex-1 overflow-y-scroll overflow-x-hidden flex flex-col-reverse"
            ref={containerRef}
            onScroll={handleScroll}
        >
            <div>
                {props.messages.map((_, index, arr) => (
                    <MessageItemRow messages={arr} index={index} />
                ))}
            </div>

            {showScrollToBottom && <ScrollToBottom onClick={scrollToBottom} />}
            {props.isLoadingMore && (
                <div className="flex w-full justify-center items-center text-3xl"><LoadingSpinner tip="" /></div>
            )}
            {props.title && !props.hasMoreMessage && <ChatMessageHeader title={props.title} />}
        </div>
    )
})
NormalMessageList.displayName = 'NormalMessageList'
export default NormalMessageList
