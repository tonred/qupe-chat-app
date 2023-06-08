import React from 'react'

import { Intersection } from '@/components/common/Intersection'
import { useMemoizedFn } from '@/hooks/useMemoizedFn'
import { debug } from '@/utils'

interface MessageAckContainerProps extends React.PropsWithChildren {
    converseId: number
    messageId: number
}

export const MessageAckContainer: React.FC<MessageAckContainerProps> = React.memo(props => {
    // const { updateConverseAck } = useConverseAck(props.converseId)
    const updateConverseAck = (id: number): void => {
        debug('updateConverseAck:', id)
    }
    const handleIntersection = useMemoizedFn(() => {
        updateConverseAck(props.messageId)
    })

    return <Intersection onIntersection={handleIntersection}>{props.children}</Intersection>
})
MessageAckContainer.displayName = 'MessageAckContainer'
