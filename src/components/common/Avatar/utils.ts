import _isString from 'lodash/isString'
import str2int from 'str2int'

const colors = [
    '#333333',
    '#2c3e50',
    '#8e44ad',
    '#2980b9',
    '#27ae60',
    '#16a085',
    '#f39c12',
    '#d35400',
    '#c0392b',
    '#3498db',
    '#9b59b6',
    '#2ecc71',
    '#1abc9c',
    '#f1c40f',
    '#e74c3c',
    '#e67e22',
]

export function getTextColorHex(text: unknown): string {
    if (!text || !_isString(text)) {
        return '#ffffff'
    }

    const id = str2int(text)
    return colors[id % colors.length]
}

export function px2rem(size: number): string {
    return `${size * (1 / 16)}rem`
}
