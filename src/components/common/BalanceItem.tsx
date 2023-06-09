import React, {
    useState,
} from 'react'
import {
    Space, Button, Row, Col, InputNumber,
} from 'antd'
import { Address } from 'everscale-inpage-provider'

import { formattedAmount, sliceAddress } from '@/utils'
import { useToken } from '@/hooks/useToken'

export const BalanceItem: React.FC<{
    disabled: boolean
    address: string,
    balance: string,
    onAction: (isWithdraw: boolean, token: string, amount: string) => void
    onlyWithdraw?: boolean
}> = React.memo(props => {
    const {
        disabled, address, balance, onAction, onlyWithdraw = false,
    } = props
    const token = useToken(new Address(address))
    const [depositAmount, setDepositAmount] = useState('0')
    const [withdrawAmount, setWithdrawAmount] = useState('0')
    return (
        <div className="w-full py-3 border-b border-white border-opacity-20">
            <Row className="space-x-1">
                <Col flex={1} className="font-bold">{token?.name || sliceAddress(address)}</Col>
                <Col className="w-14 flex">
                    <span className="my-auto">
                        {formattedAmount(balance, token?.decimals)}
                    </span>
                </Col>
                {!onlyWithdraw && (
                    <Col>
                        <Space.Compact style={{ width: '100%' }}>
                            <InputNumber<string>
                                placeholder="Amount"
                                style={{ width: 100 }}
                                min="0"
                                max="9999999"
                                step="0.1"
                                onChange={v => v && setDepositAmount(v)}
                                stringMode
                            />
                            <Button
                                disabled={disabled}
                                onClick={() => {
                                    onAction(false, address, depositAmount)
                                }} type="primary"
                            >
                                Deposit
                            </Button>
                        </Space.Compact>
                    </Col>
                )}
                <Col>
                    {onlyWithdraw ? (
                        <Button
                            disabled={disabled}
                            onClick={() => {
                                onAction(true, address, withdrawAmount)
                            }} type="primary"
                        >
                            Withdraw
                        </Button>
                    ) : (
                        <Space.Compact style={{ width: '100%' }}>
                            {!onlyWithdraw && (
                                <InputNumber<string>
                                    placeholder="Amount"
                                    style={{ width: 100 }}
                                    min="0"
                                    max="9999999"
                                    step="0.1"
                                    onChange={v => v && setWithdrawAmount(v)}
                                    stringMode
                                />
                            )}
                            <Button
                                disabled={disabled}
                                onClick={() => {
                                    onAction(true, address, withdrawAmount)
                                }} type="primary"
                            >
                                Withdraw
                            </Button>
                        </Space.Compact>
                    )}

                </Col>
            </Row>
        </div>
    )
})

BalanceItem.displayName = 'BalanceItem'
