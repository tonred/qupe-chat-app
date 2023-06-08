import React, { type PropsWithChildren, useEffect } from 'react'
import { Divider, Empty } from 'antd'
import { useParams } from 'react-router-dom'

import NormalList from '@/components/common/Chat/MessagesList/NormalList'
import { useChatRoomContext } from '@/context/ChatRoomContext'
import { ChatPlaceholder } from '@/components/common/Chat/ChatPlaceholder'
import { useChatServerContext } from '@/context/ChatServerContext'
import { MessageRender } from '@/components/common/Chat/Message/render'
import { debug } from '@/utils'

import Header from './Header'
import './index.less'

const Chat: React.FC<PropsWithChildren<{ isJoined: boolean }>> = React.memo(props => {
    const {
        chatRoom, messages, subscription, loading, hasMoreMessages, loadMoreMessages,
    } = useChatRoomContext()
    const { roomId = '-1' } = useParams<{
        roomId: string
    }>()
    // @ts-ignore
    // eslint-disable-next-line consistent-return
    useEffect(() => {
        if (subscription) {
            return () => {
                debug('unsub')
                subscription.unsubscribe()
            }
        }
    }, [subscription])

    if (roomId === '-1') {
        const { chatServer } = useChatServerContext()
        if (!chatServer) return null
        const title = chatServer.info()?.meta.title || 'Home'
        const description = chatServer.info()?.meta.description || 'No description'
        return (
            <>
                <Header>
                    <h3>Homepage</h3>
                </Header>
                <div className="flex-1 overflow-hidden">
                    <div className="w-full h-full flex flex-col select-text relative text-sm p-12 flex-1 overflow-y-scroll overflow-x-hidden">
                        <h1><b>{title}</b></h1>
                        <Divider />
                        <div className="chat-homepage-description leading-6 break-words">
                            <span>
                                <MessageRender content={description} />
                            </span>
                        </div>
                    </div>
                </div>
                {!props.isJoined && props.children}
            </>
        )
    }
    let contentEl
    // eslint-disable-next-line no-constant-condition
    if (messages.length === 0 && loading) {
        contentEl = <ChatPlaceholder />
    }
    else
    if (!chatRoom?.isDeployed && messages.length === 0) {
        contentEl = (
            <div className="flex justify-center items-center h-full">
                <Empty description={<h2>No data</h2>} />
            </div>
        )
    }
    else {
        contentEl = (
            <NormalList
                title={chatRoom?.info()?.meta.title || 'Home'}
                messages={messages}
                isLoadingMore={loading}
                hasMoreMessage={hasMoreMessages}
                onLoadMore={() => loadMoreMessages(30)}
            />
        )
    }
    return (
        <>
            <Header>
                <h3>{chatRoom?.info()?.meta.title || 'Home'}</h3>
            </Header>
            <div className="flex-1 overflow-hidden">
                <div className="w-full h-full flex flex-col select-text relative text-sm">
                    {contentEl}
                    {props.children}
                </div>
            </div>
        </>
    )
})

Chat.displayName = 'Chat'

export default Chat
