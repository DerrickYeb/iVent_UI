import {useState} from 'react';
import {AppShell, Burger, Header, MediaQuery, Navbar, Text, useMantineTheme, ScrollArea} from '@mantine/core';
import TitleAndLogoWidget from "../Widgets/TitleAndLogoWidget";
import HeaderAvatarWidget from "../Widgets/HeaderAvatarWidget";
import SetupsMenuItem from "./MenuItems/SetupsMenuItem";
import HeaderSearch from "./HeaderSearch";
import DashboardMenuItem from "./MenuItems/DashboardMenuItem";
import InventoryMenuItem from "./MenuItems/InventoryMenuItem";
import PurchaseMenuItem from "./MenuItems/PurchaseMenuItem";
import CustomersMenuItem from "./MenuItems/CustomersMenuItem";
import SuppliersMenuItem from "./MenuItems/SuppliersMenuItem";
import SalesMenuItem from "./MenuItems/SalesMenuItem";
import ReportsMenuItem from "./MenuItems/ReportsMenuItem";
import PaymentsMenuItem from "./MenuItems/PaymentsMenuItem";

export default function SideMenu({children, title = "Dashboard"}) {
    const [opened, setOpened] = useState(false);
    const theme = useMantineTheme();

    return (
        <AppShell
            // navbarOffsetBreakpoint controls when navbar should no longer be offset with padding-left
            navbarOffsetBreakpoint="sm"
            // fixed prop on AppShell will be automatically added to Header and Navbar
            fixed
            padding={0} 
            navbar={
                <Navbar
                    //component={ScrollArea}
                    padding="xs"
                    // Breakpoint at which navbar will be hidden if hidden prop is true
                    hiddenBreakpoint="sm"
                    // Hides navbar when viewport size is less than value specified in hiddenBreakpoint
                    hidden={!opened}
                    // when viewport size is less than theme.breakpoints.sm navbar width is 100%
                    // viewport size > theme.breakpoints.sm – width is 300px
                    // viewport size > theme.breakpoints.lg – width is 400px
                    width={{sm: 300, lg: 250}}
                    style={{
                        // backgroundColor: "",
                        backgroundColor:"#582A72",
                        '&:hover':{
                            backgroundColor:"#582A47"
                        }
                    }}
                >
                    <DashboardMenuItem/>
                    <SetupsMenuItem/>
                    <InventoryMenuItem/>
                    <SalesMenuItem/>
                    <PaymentsMenuItem/>
                    {/*<PurchaseMenuItem/>*/}
                    <CustomersMenuItem/>
                    <SuppliersMenuItem/>
                    <ReportsMenuItem/>
                </Navbar>
            }
            header={
                <Header height={79} padding="0">
                    {/* Handle other responsive styles with MediaQuery component or createStyles function */}
                    <div style={{height: '100%'}}>
                        <div className="flex items-center justify-between bg-gray-700">
                            {/*    left*/}
                            <div>
                                <TitleAndLogoWidget/>
                            </div>
                            {/*    center */}
                            <HeaderSearch/>
                            {/*    right*/}
                            <div>
                                <HeaderAvatarWidget/>
                            </div>
                        </div>

                    </div>
                </Header>
            }
        >
            <div className="p-0">
                {children}
            </div>

        </AppShell>
    );
}
