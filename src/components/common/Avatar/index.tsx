import React, { useMemo } from 'react'
import { Avatar as AntdAvatar, Badge } from 'antd'
import _head from 'lodash/head'
import _upperCase from 'lodash/upperCase'
import _isNil from 'lodash/isNil'
import _isEmpty from 'lodash/isEmpty'
import _isNumber from 'lodash/isNumber'
import _omit from 'lodash/omit'
import { type AvatarProps as AntdAvatarProps } from 'antd/lib/avatar'

import { getTextColorHex, px2rem } from './utils'
// import { isValidStr } from '@/utils'
// import { imageUrlParser } from '../Image'

export { getTextColorHex }

export interface AvatarProps extends AntdAvatarProps {
  name?: string;
  isOnline?: boolean;
}
export const Avatar: React.FC<AvatarProps> = React.memo(_props => {
    const { isOnline, ...props } = _props
    // const src = isValidStr(props.src) ? imageUrlParser(props.src) : undefined
    const src = undefined
    const name = useMemo(
        () => (props.name ? _upperCase(_head([...props.name])) : ''),
        [props.name],
    )

    const color = useMemo(
        () => (
            _isEmpty(src) && _isNil(props.icon)
                ? getTextColorHex(props.name)
                : undefined),
        [src, props.icon, props.name],
    )

    const style: React.CSSProperties = useMemo(
        () => ({
            alignItems: 'center',
            backgroundColor: color,
            display: 'flex',
            justifyContent: 'center',
            userSelect: 'none',
            ...props.style,
        }),
        [props.style, color],
    )

    if (_isNumber(props.size)) {
    // 为了支持rem统一管理宽度，将size转换为样式宽度(size类型上不支持rem单位)
        style.width = px2rem(props.size)
        style.height = px2rem(props.size)

        if (typeof style.fontSize === 'undefined') {
            // 如果props.size是数字且没有指定文字大小
            // 则自动增加fontSize大小
            style.fontSize = px2rem(props.size * 0.4)
        }
    }

    const inner = (
        <AntdAvatar {..._omit(props, ['size'])} src={src} style={style}>
            {name}
        </AntdAvatar>
    )

    if (typeof isOnline === 'boolean') {
        const style_ = {
            bottom: 0,
            top: 'auto',
        }

        if (isOnline === true) {
            return (
                <Badge dot color="green" style={style_}>
                    {inner}
                </Badge>
            )
        }

        return (
            <Badge dot color="#999" style={style_}>
                {inner}
            </Badge>
        )

    }

    return inner
})
Avatar.displayName = 'Avatar'
