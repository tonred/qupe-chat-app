import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'

import 'dayjs/locale/en'

/**
 * Reference: https://day.js.org/
 */

dayjs.extend(relativeTime)
dayjs.extend(duration)
dayjs.locale('en')

export function isToday(date: dayjs.ConfigType): boolean {
    return dayjs(date).isSame(dayjs(), 'd')
}

export function getMessageTimeDiff(input: Date): string {
    const date = dayjs(input)

    if (isToday(date)) {
        return date.fromNow()
    }
    return date.format('YYYY-MM-DD HH:mm:ss')
}

export function shouldShowMessageTime(date1: Date, date2: Date): boolean {
    return Math.abs(date1.valueOf() - date2.valueOf()) > 12 * 60 * 60 * 1000
}

export function formatShortTimeUnix(date: number): string {
    return dayjs.unix(date).format('HH:mm')
}

export function formatShortTime(date: dayjs.ConfigType): string {
    return dayjs(date).format('HH:mm')
}

export function formatFullTime(date: dayjs.ConfigType): string {
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

export function datetimeToNow(input: dayjs.ConfigType): string {
    const date = dayjs(input)
    return date.toNow()
}

export function datetimeFromNow(input: dayjs.ConfigType): string {
    const date = dayjs(input)
    return date.fromNow()
}

export function humanizeMsDuration(ms: number): string {
    return dayjs.duration(ms, 'ms').humanize()
}

export function showMessageTime(input: Date): string {
    const date = dayjs(input)

    if (isToday(date)) {
        return formatShortTime(date)
    }
    return formatFullTime(date)
}
