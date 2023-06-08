import React from 'react'
import { Mention, MentionsInput } from 'react-mentions'

import { stopPropagation } from '@/utils/dom-helper'

const defaultChatInputBoxInputStyle = {
    highlighter: {
        boxSizing: 'border-box',
        maxHeight: 70,
        overflow: 'hidden',
    },
    input: {
        maxHeight: 70,
        overflow: 'auto',
    },
}

interface ChatInputBoxInputProps
    extends Omit<
        React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>,
        'value' | 'onChange'
    > {
    inputRef?: React.Ref<HTMLInputElement>
    value: string
    onChange: (message: string, mentions: string[]) => void
    disabled: boolean
}

export const ChatInputBoxInput: React.FC<ChatInputBoxInputProps> = React.memo(props => {
    const { users = [], panels = [] } = {}
    return (
        <MentionsInput
            autoFocus={props.autoFocus}
            inputRef={props.inputRef}
            className="chat-input"
            placeholder={props.placeholder ?? 'Write a message...'}
            disabled={props.disabled}
            style={defaultChatInputBoxInputStyle}
            maxLength={1000}
            value={props.value}
            onChange={(__, newValue, _, mentions) => props.onChange(
                newValue,
                mentions.map(m => m.id),
            )}
            onKeyDown={props.onKeyDown}
            onPaste={props.onPaste}
            onContextMenu={stopPropagation}
            allowSuggestionsAboveCursor
            forceSuggestionsAboveCursor
        >
            <Mention
                trigger="@"
                data={users}
                displayTransform={(_, display) => `@${display}`}
                appendSpaceOnAdd
                renderSuggestion={suggestion => (
                    // <UserListItem userId={String(suggestion.id)} />
                    <div>{suggestion.id}</div>
                )}
                // markup={getMessageTextDecorators().mention('__id__', '__display__')}
            />
            <Mention
                trigger="#"
                data={panels}
                displayTransform={(_, display) => `#${display}`}
                appendSpaceOnAdd
                // renderSuggestion={suggestion => (
                //     <MentionCommandItem
                //         icon="mdi:pound"
                //         label={suggestion.display ?? String(suggestion.id)}
                //     />
                // )}
                // markup={getMessageTextDecorators().url('__id__', '#__display__')}
            />
        </MentionsInput>
    )
})
ChatInputBoxInput.displayName = 'ChatInputBoxInput'
