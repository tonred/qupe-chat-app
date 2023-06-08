import React from 'react'
import { LoadingOutlined } from '@ant-design/icons'

interface LoadingSpinnerProps {
    tip?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = React.memo(props => (
    <div className="space-x-2 flex">
        <LoadingOutlined />
        <div>{props.tip ?? 'Loading'}</div>
    </div>
))
