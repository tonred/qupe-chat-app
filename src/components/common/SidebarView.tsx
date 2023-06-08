import React, {
    useState, useContext, type PropsWithChildren, useEffect,
} from 'react'
import _get from 'lodash/get'
import clsx from 'clsx'

export interface SidebarViewMenuItemType {
    type: 'item'
    title: string
    content: React.ReactNode
    hidden?: boolean
}

interface SidebarViewLinkType {
    type: 'link'
    title: string
    onClick: () => void
    isDanger?: boolean
}

const SidebarViewMenuItemTitle: React.FC<
    PropsWithChildren<{
        active?: boolean
        isDanger?: boolean
        onClick: () => void
    }>
> = React.memo(props => (
    <div
        className={clsx(
            'rounded-sm px-1.5 py-2.5 mb-1 text-gray-700 dark:text-gray-300 cursor-pointer  hover:bg-black hover:bg-opacity-10 hover:text-gray-800 dark:hover:text-gray-200',
            {
                'bg-black bg-opacity-10 text-gray-900 dark:text-white': props.active,
                'text-red-500': props.isDanger,
            },
        )}
        style={{ lineHeight: '20px', width: 192 }}
        onClick={props.onClick}
    >
        {props.children}
    </div>
))

interface SidebarViewContextProps {
    content: React.ReactNode
    setContent: (content: React.ReactNode) => void
}

export const SidebarViewContext = React.createContext<SidebarViewContextProps | null>(null)
SidebarViewContext.displayName = 'SidebarViewContext'

export type SidebarViewMenuItem = SidebarViewMenuItemType | SidebarViewLinkType
export type SidebarViewMenuType =
    | {
          type: 'group'
          title: string
          children: SidebarViewMenuItem[]
      }
    | SidebarViewMenuItem

interface SidebarViewMenuProps {
    menu: SidebarViewMenuType
}

const SidebarViewMenuItem: React.FC<SidebarViewMenuProps> = React.memo(props => {
    const { menu } = props
    const context = useContext(SidebarViewContext)

    if (!context) {
        return null
    }

    const { content, setContent } = context

    if (menu.type === 'group') {
        return (
            <div className="pb-2.5 mb-2.5 border-b last:border-0">
                <div className="px-1.5 py-2.5 pt-0 text-xs font-bold uppercase">{menu.title}</div>
                <div>
                    {menu.children.map((sub, i) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <SidebarViewMenuItem key={i} menu={sub} />
                    ))}
                </div>
            </div>
        )
    }
    if (menu.type === 'item') {
        if (menu.hidden === true) {
            return null
        }

        const component = (
            <SidebarViewMenuItemTitle
                active={content === menu.content}
                onClick={() => setContent(menu.content)}
            >
                {menu.title}
            </SidebarViewMenuItemTitle>
        )

        return <div>{component}</div>
    }
    if (menu.type === 'link') {
        return (
            <div>
                <SidebarViewMenuItemTitle isDanger={menu.isDanger} onClick={menu.onClick}>
                    {menu.title}
                </SidebarViewMenuItemTitle>
            </div>
        )
    }

    return null
})
SidebarViewMenuItem.displayName = 'SidebarViewMenuItem'

interface SidebarViewProps {
    menu: SidebarViewMenuType[]
    defaultContentPath: string
}

export const SidebarView: React.FC<SidebarViewProps> = React.memo(props => {
    const { menu, defaultContentPath = '0.children.0.content' } = props
    const [content, setContent] = useState<React.ReactNode>(_get(menu, defaultContentPath, null))
    useEffect(() => {
        setContent(_get(menu, defaultContentPath, null))
    }, [defaultContentPath])
    return (
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        <SidebarViewContext.Provider value={{ content, setContent }}>
            <div className="flex w-full h-full mobile:flex-col mobile:overflow-auto overflow-hidden">
                <div
                    className="overflow-y-hidden hover:overflow-y-smart scroll overflow-x-hidden bg-black bg-opacity-10 flex flex-col justify-start items-end py-20 px-2.5 mobile:items-start mobile:py-10 text-sm"
                    style={{ flex: '1 0 218px' }}
                >
                    {menu.map((item, i) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <SidebarViewMenuItem key={i} menu={item} />
                    ))}
                </div>

                <div
                    className="pt-24 pb-20 px-10 desktop:overflow-auto"
                    style={{ flex: '1 1 800px' }}
                >
                    {content}
                </div>
            </div>
        </SidebarViewContext.Provider>
    )
})
SidebarView.displayName = 'SidebarView'
