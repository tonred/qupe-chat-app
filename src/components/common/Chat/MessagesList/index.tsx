import React from 'react'

const MessagesList = React.memo(() => (
    <div className="flex-1 overflow-y-scroll overflow-x-hidden flex flex-col-reverse">
        <h2>content</h2>
    </div>
))

MessagesList.displayName = 'MessagesList'

export default MessagesList
