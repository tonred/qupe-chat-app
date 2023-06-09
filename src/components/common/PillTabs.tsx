import { Tabs, type TabsProps } from 'antd'
import React from 'react'

import './PillTabs.less'

export const PillTabs: React.FC<TabsProps> = React.memo(props => (
    <Tabs
        {...props} className="pill-tabs" type="card"
        animated={false}
    >
        {props.children}
    </Tabs>
))
PillTabs.displayName = 'PillTabs'

export const PillTabPane = Tabs.TabPane
