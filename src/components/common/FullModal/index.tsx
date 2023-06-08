import React, {
    type PropsWithChildren, useCallback, useEffect, useRef,
} from 'react'
import _isFunction from 'lodash/isFunction'
import clsx from 'clsx'
import { CloseCircleOutlined } from '@ant-design/icons'

interface FullModalProps extends PropsWithChildren {
    visible?: boolean
    onChangeVisible?: (visible: boolean) => void
}

export const FullModal: React.FC<FullModalProps> = React.memo(props => {
    const { visible = true, onChangeVisible } = props
    const ref = useRef<HTMLDivElement | null>(null)

    const handleClose = useCallback(() => {
        if (onChangeVisible) onChangeVisible(false)
    }, [onChangeVisible])

    useEffect(() => {
        const handler = (e: KeyboardEvent): void => {
            if (e.code === 'Escape') {
                handleClose()
            }
        }
        window.addEventListener('keyup', handler)

        return () => {
            window.removeEventListener('keyup', handler)
        }
    }, [handleClose])

    return (
        <div
            className={clsx(
                'fixed left-0 right-0 top-0 bottom-0 z-10 bg-content-light dark:bg-content-dark flex justify-center items-center',
                {
                    'opacity-0': !visible,
                },
            )}
            ref={ref}
        >
            {props.children}

            {_isFunction(onChangeVisible) && (
                <div
                    className="absolute right-8 top-8 cursor-pointer flex flex-col"
                    onClick={handleClose}
                    data-testid="full-modal-close"
                >
                    <CloseCircleOutlined className="text-3xl" />
                    <span className="text-center mt-0.5 font-bold">ESC</span>
                </div>
            )}
        </div>
    )
})
FullModal.displayName = 'FullModal'
