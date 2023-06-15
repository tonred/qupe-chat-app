import React, { useState } from 'react'
import { Divider, Dropdown, Popover } from 'antd'
import clsx from 'clsx'
import _isEmpty from 'lodash/isEmpty'
import { LoadingOutlined } from '@ant-design/icons'

import { type ChatMessage } from '@/components/common/Chat/types'
import { stopPropagation } from '@/utils/dom-helper'
import { Avatar } from '@/components/common/Avatar'
import { AutoFolder } from '@/components/common/AutoFolder'
import { type UserBaseInfo } from '@/types/user'
import { formatShortTimeUnix, shouldShowMessageTime, showMessageTime } from '@/utils/date-helper'
import { MessageAckContainer } from '@/components/common/Chat/MessagesList/MessageAckContainer'
import { UserPopover } from '@/components/common/popover/UserPopover'
import { debug, sliceAddress } from '@/utils'
import './index.less'
import { MessageRender } from '@/components/common/Chat/Message/render'


// const MessageQuote: React.FC<{ payload: ChatMessage }> = React.memo(
//     ({ payload }) => {
//         const quote = useMemo(
//             () => new MessageHelper(payload).hasReply(),
//             [payload],
//         )
//
//         if (quote === false) {
//             return null
//         }
//
//         return (
//             <div className="chat-message-item_quote border-l-4 border-black border-opacity-20 pl-2 opacity-80">
//                 {t('回复')}
//                 {' '}
//                 <UserName userId={String(quote.author)} />
//                 :
//                 {' '}
//                 <span>{getMessageRender(quote.content)}</span>
//             </div>
//         )
//     },
// )
// MessageQuote.displayName = 'MessageQuote'

// eslint-disable-next-line react/function-component-definition
const MessageActionIcon: React.FC = () => (
    null
    // <div className="text-xl px-0.5 w-6 h-6 flex justify-center items-center opacity-60 hover:opacity-100">
    //     <MoreOutlined rotate={90} />
    // </div>
)

const NormalMessage: React.FC<ChatMessageItemProps> = React.memo(props => {
    const { showAvatar, payload } = props
    const userAddress = payload.author.owner?.toString() || payload.author.address.toString()
    // const { root } = useRootContext()
    const userInfo = {
        address: userAddress,
        avatar: null,
        discriminator: '',
        nickname: payload.author.meta?.displayName || sliceAddress(userAddress),
        temporary: false,
    } as UserBaseInfo


    const [isActionBtnActive, setIsActionBtnActive] = useState(false)

    // const moreActions = useChatMessageItemAction(payload, {
    //     onClick: () => {
    //         setIsActionBtnActive(false)
    //     },
    // })
    return (
        <div
            className={clsx(
                'chat-message-item flex px-2 mobile:px-0 group relative select-text',
                {
                    'bg-black bg-opacity-10': isActionBtnActive,
                    'hover:bg-black hover:bg-opacity-5': !isActionBtnActive,
                },
            )}
            data-message-id={payload._id}
            key={payload._id}
        >
            {/* 头像 */}
            <div className="w-18 mobile:w-14 flex items-start justify-center pt-0.5">
                {showAvatar ? (
                    <Popover
                        content={
                            !_isEmpty(userInfo) && (
                                <UserPopover userInfo={userInfo as UserBaseInfo} />
                            )
                        }
                        placement="top"
                        trigger="click"
                    >
                        <Avatar
                            className="cursor-pointer"
                            size={40}
                            src={userInfo.avatar}
                            name={userInfo.nickname}
                        />
                    </Popover>
                ) : (
                    <div className="flex flex-row">
                        <div className="hidden group-hover:block opacity-40">
                            {formatShortTimeUnix(payload.createdAt || 0)}
                        </div>
                    </div>
                )}
            </div>

            <div
                className="flex flex-col flex-1 overflow-auto group"
                onContextMenu={stopPropagation}
            >
                {showAvatar && (
                    <div className="flex items-center">
                        <div className="font-bold">
                            {userInfo.nickname ?? <span>&nbsp;</span>}
                        </div>
                        <div className="hidden group-hover:block opacity-40 ml-1 text-sm">
                            {formatShortTimeUnix(payload.createdAt || 0)}
                        </div>
                    </div>
                )}

                <AutoFolder
                    maxHeight={340}
                    backgroundColor="var(--tc-content-background-color)"
                    showFullText={(
                        <div className="inline-block rounded-full bg-white dark:bg-black opacity-80 py-2 px-3 hover:opacity-100">
                            Click to expand
                        </div>
                    )}
                >
                    <div className="chat-message-item_body leading-6 break-words">
                        {payload.isHidden ? (
                            <span><i>&lt;User has been banned, message hidden&gt;</i></span>
                        ) : (
                            <span>
                                <MessageRender content={payload.content} />
                            </span>
                        ) }
                        {/* <MessageQuote payload={payload} /> */}

                        {/* <span>{getMessageRender(payload.content)}</span> */}
                        {/* <span>{payload.content}</span> */}


                    </div>
                </AutoFolder>

            </div>
            {payload.isPending && <LoadingOutlined className="p-1" />}
            <div
                className={clsx(
                    'bg-white dark:bg-black rounded absolute right-2 cursor-pointer -top-3 shadow-sm flex',
                    {
                        'opacity-0 group-hover:opacity-100 bg-opacity-80 hover:bg-opacity-100':
              !isActionBtnActive,
                        'opacity-100 bg-opacity-100': isActionBtnActive,
                    },
                )}
            >
                {/* <TcPopover */}
                {/*    overlayClassName="chat-message-item_action-popover" */}
                {/*    content={emojiAction} */}
                {/*    placement="bottomLeft" */}
                {/*    trigger={['click']} */}
                {/*    onOpenChange={setIsActionBtnActive} */}
                {/* > */}
                {/*    <div> */}
                {/*        <MessageActionIcon icon="mdi:emoticon-happy-outline" /> */}
                {/*    </div> */}
                {/* </TcPopover> */}

                <Dropdown
                    // menu={moreActions}
                    placement="bottomLeft"
                    trigger={['click']}
                    onOpenChange={setIsActionBtnActive}
                >
                    <div>
                        <MessageActionIcon />
                    </div>
                </Dropdown>
            </div>
        </div>
    )
})
NormalMessage.displayName = 'NormalMessage'

interface ChatMessageItemProps {
  showAvatar: boolean;
  payload: ChatMessage;
}

export const MessageItemRow: React.FC<{messages: ChatMessage[], index: number}> = React.memo(({ messages, index }) => {

    const message = messages[index]

    if (!message) {
        return <div />
    }

    let showDate = true,
        showAvatar = true
    const messageCreatedAt = new Date((message.createdAt || 0) * 1000)
    if (index > 0) {
        const prevMessage = messages[index - 1]
        if (
            !shouldShowMessageTime(
                new Date((prevMessage.createdAt || 0) * 1000),
                messageCreatedAt,
            )
        ) {
            showDate = false
        }
        if (!showDate) {
            showAvatar = prevMessage.author !== message.author || prevMessage.hasRecall === true
        }
    }
    debug('Render message')
    return (
        <div key={message._id}>
            {showDate && (
                <Divider className="text-sm opacity-40 px-6 font-normal select-text">
                    {showMessageTime(messageCreatedAt)}
                </Divider>
            )}

            <MessageAckContainer
                converseId={message.roomId}
                messageId={message._id}
            >
                <NormalMessage key={message._id} showAvatar={showAvatar} payload={message} />
            </MessageAckContainer>
        </div>
    )
})
