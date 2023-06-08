import React, { useState } from 'react'

import { Avatar, type AvatarProps } from './Avatar'

export const AvatarWithPreview: React.FC<AvatarProps> = React.memo(props => {
    const [visible, setVisible] = useState(false)

    const hasImage = typeof props.src === 'string'

    return (
        <>
            <div
                style={{
                    cursor: hasImage ? 'pointer' : 'auto',
                }}
                onClick={() => setVisible(!visible)}
            >
                <Avatar {...props} />
            </div>

            {/* {hasImage && ( */}
            {/*    <div */}
            {/*        style={{ */}
            {/*            display: 'none', */}
            {/*        }} */}
            {/*    > */}
            {/*        <Image */}
            {/*            preview={{ */}
            {/*                visible, */}
            {/*                src: imageUrlParser(String(props.src)), */}
            {/*                onVisibleChange: value => { */}
            {/*                    setVisible(value) */}
            {/*                }, */}
            {/*            }} */}
            {/*        /> */}
            {/*    </div> */}
            {/* )} */}
        </>
    )
})
AvatarWithPreview.displayName = 'AvatarWithPreview'
