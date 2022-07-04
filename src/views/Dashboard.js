import React from 'react';
import SideMenu from "../Helpers/SideMenu";
import PartialHeader from "../Helpers/PartialHeader";
import DashboardSvg from "../Svgicons/DashboardSvg";
import BasicStat from "../components/DashboardPartials/BasicStat";
import StatStockDetails from "../components/DashboardPartials/StatStockDetails";
import StatPurchaseOverview from "../components/DashboardPartials/StatPurchaseOverview";

export default function Dashboard() {
    return <SideMenu>
        <PartialHeader title="Dashboard" icon={<DashboardSvg/>}/>
        <div className="p-4">
            <BasicStat/>

            <div className="grid gap-6 grid-cols-1">
                <StatStockDetails/>
                {/*<StatPurchaseOverview/>*/}
            </div>
        </div>
    </SideMenu>;
}



