import React from 'react'
import { Button } from 'antd'

interface JoinButtonParams {
    loading: boolean
    callback: () => void
}

export const JoinBtn: React.FC<JoinButtonParams> = React.memo(props => (
    <div className="px-4 py-2">
        <div className="flex flex-col items-center">
            {/* <div className="flex-1 w-0"> */}
            <Button
                loading={props.loading}
                type="primary"
                size="large"
                className="px-10"
                onClick={props.callback}
            >
                Join to server
            </Button>
        </div>
        {/* </div> */}
    </div>
))
JoinBtn.displayName = 'JoinBtn'
