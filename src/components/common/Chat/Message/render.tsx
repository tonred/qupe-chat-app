import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'

// @ts-ignore
// eslint-disable-next-line react/function-component-definition
const ImageComponent: React.FC = (node, _inline, _className, _children, ..._props) => {
    const { src, alt } = node
    if (
        src.startsWith('data:image/jpeg;base64,')
        || src.startsWith('data:image/gif;base64,')
        || src.startsWith('data:image/png;base64,')) {
        return (
            <img src={src} alt={alt} />
        )
    }
    return (
        <a
            className="underline" href={src} target="_blank"
            rel="noreferrer"
        >
            {alt}
        </a>
    )
}
// @ts-ignore
// eslint-disable-next-line react/function-component-definition
const LinkComponent: React.FC = (node, _inline, _className, _children, ..._props) => {
    const { href, children } = node
    if ((href as string).startsWith('#')) {
        return <div>{_children}</div>
    }
    return (
        <a
            className="underline" href={href} target="_blank"
            rel="noreferrer"
        >
            {children}
        </a>
    )
}

interface MessageRenderProps {
    content: string
}

export const MessageRender: React.FC<MessageRenderProps> = React.memo(props => (
    <ReactMarkdown
        skipHtml
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
            a: LinkComponent,
            image: ImageComponent,
            img: ImageComponent,
            link: LinkComponent,
        }}
    >
        {props.content}
    </ReactMarkdown>
))
MessageRender.displayName = 'MessageRender'
