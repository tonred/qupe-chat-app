import React, {
    useState, useRef, useCallback, useEffect, useMemo,
} from 'react'
import { PlusOutlined } from '@ant-design/icons'
import {
    Divider, Input, Select, Space, Button,
} from 'antd'
import { type InputRef } from 'antd'
import { Address } from 'everscale-inpage-provider'

import { DefaultNetworkConfig } from '@/config'
import { sliceAddress } from '@/utils'

export const TokenSelect: React.FC<{
    onSelect: (token: Address) => void
    withCustom: boolean
}> = React.memo(props => {
    const items = useMemo(() => DefaultNetworkConfig.tokenList.map(v => ({ address: v.address, name: v.name })), [])
    const [value, setValue] = useState(items[0])
    const [name, setName] = useState('')
    const inputRef = useRef<InputRef>(null)
    useEffect(() => {
        props.onSelect(value.address)
    }, [value])
    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setName(event.target.value)
    }

    const menuRender = useCallback((menu: any) => (
        <>
            {menu}
            {props.withCustom && (
                <>
                    <Divider style={{ margin: '8px 0' }} />
                    <Space style={{ padding: '0 8px 4px' }}>
                        <Input
                            placeholder="Token root"
                            ref={inputRef}
                            value={name}
                            onChange={onNameChange}
                        />
                        <Button
                            type="text" icon={<PlusOutlined />} onClick={() => {
                                setValue({ address: new Address(name), name: sliceAddress(name) })
                                inputRef.current?.focus()
                            }}
                        >
                            Select
                        </Button>
                    </Space>
                </>
            )}

        </>
    ), [inputRef, name])

    return (
        <Select
            className="w-full"
            placeholder="Select token"
            dropdownRender={menuRender}
            value={value.name}
            options={items.map(item => ({ label: item.name, value: item.address.toString() }))}
            onChange={(a, option) => {
                if ('label' in option) {
                    setValue({ address: new Address(a), name: option.label })
                }
            }}
        />
    )
})

TokenSelect.displayName = 'TokenSelect'
