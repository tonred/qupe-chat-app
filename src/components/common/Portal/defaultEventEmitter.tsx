export class DefaultEventEmitter {

    listeners: any = {}

    emit(type: string, ...args: any[]): void {
        if (!(type in this.listeners)) {
            return
        }
        const stack = this.listeners[type]
        for (let i = 0, l = stack.length; i < l; i++) {
            // eslint-disable-next-line no-restricted-globals
            stack[i].call(this, event)
            const func = stack[i]

            if (typeof func === 'function') {
                func(...args)
            }
        }
    }

    addListener(type: string, callback: (...args: any[]) => any): void {
        if (!(type in this.listeners)) {
            this.listeners[type] = []
        }

        this.listeners[type].push(callback)
    }

    removeListener(type: string, callback: (...args: any[]) => any): any {
        if (!(type in this.listeners)) {
            return
        }
        const stack = this.listeners[type]
        for (let i = 0, l = stack.length; i < l; i++) {
            if (stack[i] === callback) {
                stack.splice(i, 1)
                // eslint-disable-next-line consistent-return
                return this.removeListener(type, callback)
            }
        }
    }

}
