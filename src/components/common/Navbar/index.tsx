import React from 'react'

import { GroupNav } from '@/components/common/Navbar/GroupNav'
import { MobileMenuBtn } from '@/components/common/Navbar/MobileMenuBtn'
import { SettingBtn } from '@/components/common/SettingBtn'

const Navbar = React.memo(() => (
    <div className="w-18 mobile:zoom-4/5 bg-navbar-light dark:bg-navbar-dark flex flex-col justify-start items-center pt-4 pb-4">
        <MobileMenuBtn />
        <div className="flex-1 w-full overflow-hidden flex flex-col">
            <div className="overflow-y-hidden hover:overflow-y-smart scroll overflow-x-hidden thin-scrollbar">
                <GroupNav />
            </div>
        </div>
        <div data-tc-role="navbar-settings" className="flex flex-col items-center space-y-2">
            <SettingBtn />
        </div>
    </div>
))

Navbar.displayName = 'Navbar'

export default Navbar
