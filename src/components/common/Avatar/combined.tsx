import React from 'react'
import _take from 'lodash/take'

import { px2rem } from './utils'

import { type AvatarProps } from '.'
import './combined.css'

interface CombinedAvatarProps {
    shape?: 'circle' | 'square'
    size?: number
    items: Pick<AvatarProps, 'name' | 'src'>[]
}

/**
 * 组装式头像
 */
export const CombinedAvatar: React.FC<CombinedAvatarProps> = React.memo(props => {
    const { size = 32, shape = 'circle' } = props
    const items = _take(props.items, 4)

    const { length } = items
    // eslint-disable-next-line unused-imports/no-unused-vars-ts
    const _getCellStyle = (i: number): React.CSSProperties => {
        if (length === 1) {
            return {}
        }

        if (length === 2) {
            if (i === 0) {
                return {
                    left: 0,
                    overflow: 'hidden',
                    position: 'absolute',
                    width: '50%',
                }
            }
            if (i === 1) {
                return {
                    overflow: 'hidden',
                    position: 'absolute',
                    right: 0,
                    width: '50%',
                }
            }
        }

        if (length === 3) {
            if (i === 0) {
                return {
                    left: 0,
                    overflow: 'hidden',
                    position: 'absolute',
                    width: '50%',
                }
            }
            if (i === 1) {
                return { transform: 'scale(50%)', transformOrigin: '100% 0 0' }
            }
            if (i === 2) {
                return { transform: 'scale(50%)', transformOrigin: '100% 100% 0' }
            }
        }

        if (length === 4) {
            if (i === 0) {
                return { transform: 'scale(50%)', transformOrigin: '0 0 0' }
            }
            if (i === 1) {
                return { transform: 'scale(50%)', transformOrigin: '100% 0 0' }
            }
            if (i === 2) {
                return { transform: 'scale(50%)', transformOrigin: '0 100% 0' }
            }
            if (i === 3) {
                return { transform: 'scale(50%)', transformOrigin: '100% 100% 0' }
            }
        }

        return {}
    }

    return (
        <div
            className={`td-combined-avatar td-combined-avatar-${length}`}
            style={{
                borderRadius: shape === 'circle' ? '50%' : 3,
                height: px2rem(size),
                width: px2rem(size),
            }}
        >
            {items.length >= 2 && <div className="line1" />}
            {items.length >= 3 && <div className="line2" />}
        </div>
    )
})
CombinedAvatar.displayName = 'CombinedAvatar'
