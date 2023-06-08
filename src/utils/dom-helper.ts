import type React from 'react'

export function getPopupContainer(): HTMLElement {
    const appRoot = document.querySelector<HTMLElement>('#app')
    if (appRoot) {
        return appRoot
    }

    return document.body
}

export function stopPropagation(e: React.BaseSyntheticEvent): void {
    e.stopPropagation()
}

export function preventDefault(e: React.BaseSyntheticEvent): void {
    e.preventDefault()
}

export function getDOMParentPath(el: HTMLElement): HTMLElement[] {
    const path: HTMLElement[] = []
    let parent = el.parentElement
    while (parent) {
        path.unshift(parent)
        parent = parent.parentElement
    }

    return path
}

export function createRAFLoop<T extends unknown[]>(loopFn: (...args: T) => void): any {
    let flag = false

    const loop = (...args: T): void => {
        if (!flag) {
            return
        }

        loopFn(...args)

        requestAnimationFrame(() => {
            loop(...args)
        })
    }

    return {
        end: () => {
            requestAnimationFrame(() => {
                flag = false
            })
        },
        start: (...args: T) => {
            flag = true
            loop(...args)
        },
    }
}
