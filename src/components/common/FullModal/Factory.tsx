import { Select, Switch } from 'antd'
import React from 'react'

import { FullModalField } from './Field'

export type FullModalFactoryConfig = {
    name: string
    label: string
    desc?: string
    defaultValue?: any
} & (
    | {
          type: 'text'
      }
    | {
          type: 'textarea'
      }
    | {
          type: 'boolean'
      }
    | {
          type: 'select'
          options: { label: string; value: string }[]
      }
)

interface FullModalFactoryProps<T = any> {
    value: T
    onChange: (val: T) => void
    config: FullModalFactoryConfig
}

export const FullModalFactory: React.FC<FullModalFactoryProps> = React.memo(props => {
    const { value, onChange, config } = props
    if (config.type === 'text') {
        return (
            <FullModalField
                title={config.label}
                value={value}
                editable
                // renderEditor={DefaultFullModalInputEditorRender}
                onSave={val => onChange(val)}
            />
        )
    }
    if (config.type === 'textarea') {
        return (
            <FullModalField
                title={config.label}
                value={value}
                editable
                // renderEditor={DefaultFullModalTextAreaEditorRender}
                onSave={val => onChange(val)}
            />
        )
    }

    if (config.type === 'boolean') {
        return (
            <FullModalField
                title={config.label}
                tip={config.desc}
                content={
                    <Switch checked={value ?? false} onChange={checked => onChange(checked)} />
                }
            />
        )
    }

    if (config.type === 'select') {
        return (
            <FullModalField
                title={config.label}
                tip={config.desc}
                content={(
                    <Select
                        style={{ width: 280 }}
                        size="large"
                        value={value}
                        onChange={val => onChange(val)}
                    >
                        {config.options.map(opt => (
                            <Select.Option key={opt.value} value={opt.value}>
                                {opt.label}
                            </Select.Option>
                        ))}
                    </Select>
                )}
            />
        )
    }

    return null
})
FullModalFactory.displayName = 'FullModalFactory'
