import _isString from 'lodash/isString'
import urlRegex from 'url-regex'

export function isAvailableString(str: unknown): boolean {
    return typeof str === 'string' && str.length > 0
}

export function isUrl(str: string): boolean {
    return urlRegex({ exact: true }).test(str)
}

export const isBlobUrl = (str: string): boolean => _isString(str) && str.startsWith('blob:')

export const getUrls = (str: string): string[] => str.match(urlRegex()) ?? []

export function is(it: string): boolean {
    return !!it && it !== '0' && it !== 'false'
}

export function isValidStr(str: unknown): str is string {
    return typeof str === 'string' && str !== ''
}
