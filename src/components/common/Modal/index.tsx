import React, {
    type PropsWithChildren, useCallback, useContext, useState,
} from 'react'
import _isFunction from 'lodash/isFunction'
import _isNil from 'lodash/isNil'
import _last from 'lodash/last'
import _pull from 'lodash/pull'
import _isString from 'lodash/isString'
import _noop from 'lodash/noop'
import { Button, Typography } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { CSSTransition } from 'react-transition-group'
import clsx from 'clsx'

import { stopPropagation } from '@/utils/dom-helper'
import { PortalAdd, PortalRemove } from '@/components/common/Portal'
import './index.less'
import { useIsMobile } from '@/hooks/useIsMobile'

const transitionEndListener = (node: HTMLElement, done: () => void): void => node.addEventListener('transitionend', done, false)

const ModalContext = React.createContext<{
    closeModal:() => void
        }>({
            closeModal: _noop,
        })

interface ModalProps extends PropsWithChildren {
    visible?: boolean
    onChangeVisible?: (visible: boolean) => void

    closable?: boolean

    maskClosable?: boolean
}

export const Modal: React.FC<ModalProps> = React.memo(props => {
    const {
        visible, onChangeVisible, closable = false, maskClosable = true,
    } = props
    const [showing, setShowing] = useState(true)

    const closeModal_ = useCallback(() => {
        setShowing(false)
    }, [])

    const handleClose = useCallback(() => {
        if (!maskClosable) return

        closeModal_()
    }, [maskClosable, closeModal_])

    if (visible === false) {
        return null
    }

    return (
        <CSSTransition
            in={showing}
            classNames="modal-anim"
            timeout={200}
            addEndListener={transitionEndListener}
            onExited={() => {
                if (!showing && _isFunction(onChangeVisible)) {
                    onChangeVisible(false)
                }
            }}
            appear
        >
            <div
                className="dark absolute left-0 right-0 top-0 bottom-0 bg-black bg-opacity-60 flex justify-center items-center z-10"
                onClick={handleClose}
            >
                {/* eslint-disable-next-line react/jsx-no-constructed-context-values */}
                <ModalContext.Provider value={{ closeModal: closeModal_ }}>
                    <div
                        className="modal-inner bg-content-light dark:bg-content-dark rounded overflow-auto relative z-10"
                        style={{ maxHeight: '80vh', maxWidth: '80vw' }}
                        onClick={stopPropagation}
                    >
                        {closable && (
                            <CloseOutlined
                                className="absolute right-2.5 top-3.5 text-xl z-10 cursor-pointer"
                                onClick={closeModal_}
                            />
                        )}
                        {props.children}
                    </div>
                </ModalContext.Provider>
            </div>
        </CSSTransition>
    )
})
Modal.displayName = 'Modal'

const modelKeyStack: number[] = []

export function closeModal(key?: number): void {
    let k = key
    if (_isNil(key)) {
        k = _last(modelKeyStack)
    }

    if (typeof k === 'number') {
        _pull(modelKeyStack, k)

        PortalRemove(k)
    }
}

export function openModal(
    content: React.ReactNode,
    props?: Pick<ModalProps, 'closable' | 'maskClosable'> & {
        onCloseModal?: () => void | Promise<void>
    },
): number {
    const key = PortalAdd(
        <Modal
            {...props}
            visible
            onChangeVisible={async visible => {
                if (!visible) {
                    if (typeof props?.onCloseModal === 'function') {
                        await props.onCloseModal()
                    }

                    closeModal(key)
                }
            }}
        >
            {content}
        </Modal>,
    )

    modelKeyStack.push(key)

    return key
}

export const ModalWrapper: React.FC<
    PropsWithChildren<{
        title?: string
        className?: string
        style?: React.CSSProperties
    }>
> = React.memo(props => {
    const isMobile = useIsMobile()

    const title = _isString(props.title) ? (
        <Typography.Title level={4} className="text-center mb-4">
            {props.title}
        </Typography.Title>
    ) : null

    return (
        <div
            className={clsx('tc-modal', 'p-4', props.className)}
            style={{
                backgroundColor: 'var(--tc-content-background-color)',
                minWidth: isMobile ? 290 : 420,
                ...props.style,
            }}
        >
            {title}
            {props.children}
        </div>
    )
})
ModalWrapper.displayName = 'ModalWrapper'

interface OpenConfirmModalProps {
    onConfirm: () => void
    onCancel?: () => void
    title?: string
    content?: string
}

export function openConfirmModal(props: OpenConfirmModalProps): void {
    const key = openModal(
        <ModalWrapper title={props.title ?? 'Confirm operation'}>
            <h3 className="text-center pb-6">{props.content}</h3>
            <div className="space-x-2 text-right">
                <Button
                    onClick={() => {
                        props.onCancel?.()
                        closeModal(key)
                    }}
                >
                    Cancel
                </Button>
                <Button
                    type="primary"
                    onClick={() => {
                        props.onConfirm()
                        closeModal(key)
                    }}
                >
                    Confirm
                </Button>
            </div>
        </ModalWrapper>,
        {
            onCloseModal: props.onCancel,
        },
    )
}

type OpenReconfirmModalProps = Pick<
    OpenConfirmModalProps,
    'title' | 'content' | 'onConfirm' | 'onCancel'
>

export function openReconfirmModal(props: OpenReconfirmModalProps): void {
    openConfirmModal({
        content: props.content ?? '该操作无法被撤回',
        onCancel: props.onCancel,
        onConfirm: props.onConfirm,
        title: props.title ?? '确认要进行该操作么?',
    })
}

export function openReconfirmModalP(
    props?: Omit<OpenReconfirmModalProps, 'onConfirm' | 'onCancel'>,
): Promise<boolean> {
    return new Promise<boolean>(resolve => {
        openReconfirmModal({
            ...props,
            onCancel: () => resolve(false),
            onConfirm: () => resolve(true),
        })
    })
}

export function useModalContext(): {closeModal: () => void} {
    const { closeModal: cm } = useContext(ModalContext)

    return { closeModal: cm }
}
