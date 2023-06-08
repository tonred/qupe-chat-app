import React, { useCallback, useEffect, useState } from 'react'
import _isString from 'lodash/isString'
import { Input, Space } from 'antd'
import _isNil from 'lodash/isNil'
import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined } from '@ant-design/icons'
import clsx from 'clsx'

export type FullModalFieldEditorRenderComponent = React.FC<{
    value: string
    onChange: (val: string) => void
}>

interface FullModalFieldProps {
    title: React.ReactNode
    tip?: React.ReactNode
    content?: React.ReactNode
    editable?: boolean
    value?: string
    renderEditor?: FullModalFieldEditorRenderComponent

    onSave?: (val?: string) => void
    widthFull?: boolean
}

function useTitle(value?: string): string | undefined {
    return _isString(value) ? value : undefined
}

const FullModalFieldEditor: React.FC<FullModalFieldProps> = React.memo(props => {
    const [isEditing, setIsEditing] = useState(false)
    const [editingValue, setEditingValue] = useState(props.value ?? '')
    const valueTitle = useTitle(props.value)

    useEffect(() => {
        setEditingValue(props.value ?? '')
    }, [props.value])

    const handleEditing = useCallback(() => {
        if (isEditing) {
            setIsEditing(false)
            setEditingValue(props.value ?? '')
            props.onSave?.(undefined)
        }
        else {
            setIsEditing(true)
        }
    }, [props.value, isEditing])

    const handleSave = useCallback(() => {
        props.onSave?.(editingValue)
        setIsEditing(false)
    }, [props.onSave, editingValue])

    const EditorComponent = props.renderEditor

    return (
        <div className="flex w-full">
            {/* 内容 */}
            <div className={clsx('truncate', { 'w-full': props.widthFull && isEditing })}>
                {isEditing && !_isNil(EditorComponent) ? (
                    <EditorComponent value={editingValue} onChange={setEditingValue} />
                ) : (
                    <span className="select-text" title={valueTitle}>
                        {props.content ?? props.value}
                    </span>
                )}
            </div>

            <div className="ml-2">
                {!isEditing ? (
                    <EditOutlined onClick={handleEditing} />
                ) : (
                    <Space className="h-full">
                        <CloseCircleOutlined
                            className="text-xl hover:text-red-500"
                            onClick={handleEditing}
                        />
                        <CheckCircleOutlined
                            className="text-xl hover:text-green-500"
                            onClick={handleSave}
                        />
                    </Space>
                )}
            </div>
        </div>
    )
})
FullModalFieldEditor.displayName = 'FullModalFieldEditor'

export const FullModalField: React.FC<FullModalFieldProps> = React.memo(props => {
    const valueTitle = useTitle(props.value)

    const allowEditor = props.editable === true && !_isNil(props.renderEditor)

    return (
        <div className="mb-4">
            <div className="text-xs text-gray-400 mb-2 flex items-center">
                <span>{props.title}</span>
                {props.tip && (
                    <span className="ml-1 text-sm">{/* <TipIcon content={props.tip} /> */}</span>
                )}
            </div>
            <div className="min-h-10 text-base truncate">
                {allowEditor ? (
                    <FullModalFieldEditor {...props} />
                ) : (
                    <span className="select-text" title={valueTitle}>
                        {props.content ?? props.value}
                    </span>
                )}
            </div>
        </div>
    )
})
FullModalField.displayName = 'FullModalField'

// eslint-disable-next-line react/function-component-definition
export const DefaultFullModalInputEditorRender: FullModalFieldEditorRenderComponent = ({
    value,
    onChange,
}) => <Input value={value} onChange={e => onChange(e.target.value)} />

// eslint-disable-next-line react/function-component-definition
export const DefaultFullModalTextAreaEditorRender: FullModalFieldEditorRenderComponent = ({
    value,
    onChange,
}) => (
    <Input.TextArea
        className="w-full"
        autoSize={{ maxRows: 15, minRows: 2 }}
        value={value}
        onChange={e => onChange(e.target.value)}
    />
)
