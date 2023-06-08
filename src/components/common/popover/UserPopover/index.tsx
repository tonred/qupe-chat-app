import React from 'react'

import { type UserBaseInfo } from '@/types/user'

import { PersonalUserPopover } from './PersonalUserPopover'

/**
 * Common Entry for User Popover
 */
export const UserPopover: React.FC<{
    userInfo: UserBaseInfo
}> = React.memo(props => <PersonalUserPopover userInfo={props.userInfo} />)

UserPopover.displayName = 'UserPopover'
