import React, { type PropsWithChildren } from 'react'

import { type UserBaseInfo } from '@/types/user'

import { getTextColorHex } from './Avatar'
import { AvatarWithPreview } from './AvatarWithPreview'

export const UserProfileContainer: React.FC<PropsWithChildren<{ userInfo: UserBaseInfo }>> = React.memo(props => {
    const { userInfo } = props

    const bannerColor = getTextColorHex(userInfo.nickname)

    return (
        <div className="relative bg-inherit">
            <div
                style={{
                    backgroundColor: bannerColor,
                    height: 60,
                    width: '100%',
                }}
            />

            <div className="absolute p-1 rounded-1/2 -mt-11 ml-3 bg-inherit">
                <AvatarWithPreview size={80} src={userInfo.avatar} name={userInfo.nickname} />
            </div>

            <div className="p-2 mt-10">{props.children}</div>
        </div>
    )
})
UserProfileContainer.displayName = 'UserProfileContainer'
