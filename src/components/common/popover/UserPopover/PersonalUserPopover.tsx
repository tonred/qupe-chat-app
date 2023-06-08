import { Space, Tag } from 'antd'
import React from 'react'

import { type UserBaseInfo } from '@/types/user'
import { UserProfileContainer } from '@/components/common/UserProfileContainer'
import { DefaultNetworkConfig } from '@/config'
import { sliceAddress } from '@/utils'

export const PersonalUserPopover: React.FC<{
    userInfo: UserBaseInfo
}> = React.memo(props => {
    const { userInfo } = props

    // useEffect(() => {
    //     // if (userInfo.avatar) {
    //     //     fetchImagePrimaryColor(userInfo.avatar).then(rgba => {
    //     //         console.log('fetchImagePrimaryColor', rgba)
    //     //     })
    //     // }
    // }, [userInfo.avatar])

    return (
        <div className="w-80 -mx-4 -my-3 bg-inherit">
            <UserProfileContainer userInfo={userInfo}>
                <div className="text-xl">
                    <span className="font-semibold">{userInfo.nickname}</span>
                    <span className="opacity-60 ml-1">
                        #
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href={DefaultNetworkConfig.explorer.account.replace(
                                '{{ADDR}}',
                                userInfo.address,
                            )}
                        >
                            {sliceAddress(userInfo.address)}
                        </a>
                    </span>
                </div>

                <Space size={4} wrap className="py-1">
                    {userInfo.temporary && <Tag color="processing">Guest</Tag>}
                </Space>
            </UserProfileContainer>
        </div>
    )
})
PersonalUserPopover.displayName = 'PersonalUserPopover'
