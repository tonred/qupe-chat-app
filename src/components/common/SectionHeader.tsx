import React, { type PropsWithChildren, useState } from 'react'
import { Dropdown, type MenuProps } from 'antd'
import clsx from 'clsx'
import { DownOutlined } from '@ant-design/icons'

interface SectionHeaderProps extends PropsWithChildren {
    'menu'?: MenuProps
    'data-testid'?: string
}

export const SectionHeader: React.FC<SectionHeaderProps> = React.memo(props => {
    const [visible, setVisible] = useState(false)

    return (
        <div className="h-12 relative flex items-center py-0 text-base font-bold flex-shrink-0 thin-line-bottom">
            {props.menu ? (
                <Dropdown
                    className="overflow-hidden"
                    onOpenChange={setVisible}
                    menu={props.menu}
                    placement="topRight"
                    trigger={['click']}
                >
                    <div className="cursor-pointer flex flex-1" data-testid={props['data-testid']}>
                        <header className="flex-1 truncate px-4">{props.children}</header>
                        <DownOutlined
                            className={clsx('transition-transform transform px-2', {
                                'rotate-180': visible,
                            })}
                        />
                    </div>
                </Dropdown>
            ) : (
                <header className="flex-1 truncate px-4" data-testid={props['data-testid']}>
                    {props.children}
                </header>
            )}
        </div>
    )
})
SectionHeader.displayName = 'SectionHeader'
