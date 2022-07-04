import {ActionIcon, Menu, Tooltip, Button, Tabs, Divider, ScrollArea} from "@mantine/core";
import {ChevronDown, XCircle} from "react-feather";
import {CustomersTypeToArray, formatDate, MoneyFormat, SalesOrdersStatus, StockStatus} from "../../Helpers/Constants";
import {BasicRightDrawerUtils} from "../../modals/ModalUtils";
import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import useSWR from "swr";
import {getAxios} from "../../Helpers/API";
import moment from "moment";
import useAjaxError from "../../Helpers/useAjaxError";
import SalesOrdersButtonGroup, {StockDetailsButtonGroup} from "../SalesOrders/SalesOrdersButtonGroup";
import SalesOrderStatusToggle from "../SalesOrders/SalesOrderStatusToggle";
import SalesOrderOrderInfo from "../SalesOrders/SalesOrderOrderInfo";
import {NewInventoryUrl} from "../../Helpers/UrlHelper";
import StockDetailsInfo from "./StockDetailsInfo";
import TabLabelWidget from "../../Widgets/TabLabelWidget";
import NewStockAdjustment from "./NewStockAdjustment";
import StockAdjustmentHistory from "./StockAdjustmentHistory";
import StockTransactions from "./StockTransactions";
import useToasts from "../../Helpers/MyToasts";

export default function StockDetails({open, onClose, object}) {
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [ajaxError] = useAjaxError();
    const [openStockAdjustmentDrawer, setOpenStockAdjustmentDrawer] = useState(false);
    const history = useHistory();
    const {
        data: d,
        mutate,
        error: err
    } = useSWR(object?.ProductId ? `stocks/get/stock?stockId=${object?.ProductId}` : null, getAxios);


    return <React.Fragment><BasicRightDrawerUtils open={open} onClose={onClose} size="82%">
        <div className="flex items-start">
            {/*    left section*/}
            <div className="border-r border-gray-200 w-2/6 flex-grow">
                <div className="flex p-4 items-center justify-end border-b">


                    <Button variant="filled"
                            onClick={() => history.push(NewInventoryUrl)}
                            size={"xs"}
                            compact
                            leftIcon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none"
                                           viewBox="0 0 24 24"
                                           stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>}>
                        New
                    </Button>
                </div>
                {/*  sales orders list*/}
                <EachProductCard data={object}/>
            </div>


            {/*right section*/}
            <div className="flex-grow w-4/6 bg-white">
                {/*top action buttons*/}
                <div className="items-center bg-white p-4 flex justify-between space-x-4">
                    <div>{object?.OrderId}</div>

                    {/*action buttons*/}
                    <div className="flex space-x-4 items-center">
                        <div>
                            <StockDetailsButtonGroup data={d}/>
                        </div>
                        <div><Button variant={"light"} onClick={() => setOpenStockAdjustmentDrawer(true)}>Adjust
                            Stock</Button></div>
                        <div>
                            <MoreMenu stock={d} mutate={mutate}/>
                        </div>
                    </div>
                    {/*action buttons*/}
                    {/*close button*/}
                    <div>
                        <ActionIcon variant="hover" onClick={onClose} size={"sm"}><XCircle/></ActionIcon>
                    </div>
                </div>

                {/*stock name and batch no*/}
                <div className="flex flex-col p-4">
                    <span className="text-xl font-semibold">{d?.ProductName}</span>
                    <span className="text-gray-600 text-sm">Batch No: {d?.ProductSKU}</span>
                </div>
                {/*    divider*/}
                <Divider/>
                {/*    tabs*/}

                <Tabs>
                    <Tabs.Tab label={<TabLabelWidget title="Stock Info"/>}>
                        <ScrollArea style={{height: 450}}>
                            <div className="p-2">
                                <StockDetailsInfo stock={d}/>
                            </div>

                        </ScrollArea>
                    </Tabs.Tab>
                    <Tabs.Tab label={<TabLabelWidget title="Transactions"/>}>
                        <ScrollArea style={{height: 420}}>
                            <div className="p-4">
                                <StockTransactions stockId={d?.ProductId}/>
                            </div>
                        </ScrollArea>
                    </Tabs.Tab>
                    <Tabs.Tab label={<TabLabelWidget title="Adjustments"/>}>
                        <ScrollArea style={{height: 420}}>
                            <div className="p-4">
                                <StockAdjustmentHistory productId={d?.ProductId}/>
                            </div>
                        </ScrollArea>
                    </Tabs.Tab>
                    <Tabs.Tab label={<TabLabelWidget title="Stock Lifespans"/>}>
                        <ScrollArea style={{height: 420}}>
                            <div className="p-4">
                                <div className="flex flex-col space-y-4">
                                    <div className="grid gap-4 grid-cols-2">
                                        <span className="font-semibold">Manufacture Date</span>
                                        <span>{formatDate(d?.ProductManufactureDate)}</span>
                                    </div>

                                    <div className="grid gap-4 grid-cols-2">
                                        <span className="font-semibold">Expire Date</span>
                                        <span>{formatDate(d?.ProductExpireDate)}</span>
                                    </div>

                                    <div className="grid gap-4 grid-cols-2">
                                        <span className="font-semibold">Shelf Life</span>
                                        <span>{d?.ProductShelfLife}</span>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </Tabs.Tab>
                    <Tabs.Tab label={<TabLabelWidget title="Images"/>}>
                        <ScrollArea style={{height: 420}}>
                            <div className="p-4">
                                <StockImages images={d?.Images}/>
                            </div>
                        </ScrollArea>
                    </Tabs.Tab>
                </Tabs>

            </div>
        </div>
    </BasicRightDrawerUtils>

        {/*    new stock adjustment drawer*/}
        <NewStockAdjustment data={d} open={openStockAdjustmentDrawer}
                            onClose={() => setOpenStockAdjustmentDrawer(false)}/>
    </React.Fragment>
}


function EachProductCard({data}) {
    return <div className="flex justify-between p-4 text-gray-600 text-xs">
        <div className="flex flex-col space-y-1">
            <span className="text-gray-800 text-text font-semibold">{data?.ProductName}</span>
            <div className="flex items-center space-x-2">
                <span>Added Date:</span>
                <span>{moment(data?.Dated).format("ll")}</span>
            </div>
            <span className="text-xs">Batch No. {data?.ProductSKU}</span>
        </div>
    </div>
}


function MoreMenu({stock: v, mutate}) {
    const [isWorking, setIsWorking] = useState(false);
    const [ajaxError] = useAjaxError();
    const [toast] = useToasts();

    async function toggleVisibility() {
        const result = await getAxios(`stocks/toggle/visibility?productId=${v?.ProductId}&value=${!v?.ProductVisibility}`).catch(ajaxError);
        if (result) {
            toast("Stock visibility toggled", "success");
            await mutate(`stocks/get/stock?stockId=${v?.ProductId}`, true)
        }
    }

    async function toggleActive() {
        const value = v?.ProductStatus === StockStatus[0].value ? "Inactive" : "Active";
        const result = await getAxios(`stocks/toggle/status?productId=${v?.ProductId}&value=${value}`).catch(ajaxError);
        if (result) {
            toast("Stock status toggled", "success");
            await mutate(`stocks/get/stock?stockId=${v?.ProductId}`, true)
        }
    }

    return <Menu withArrow={true} position={"bottom"} trigger="click" delay={500}
                 control={<Button variant="subtle">More</Button>}
    >
        {/*toggle visibility*/}
        <Menu.Item color={v?.ProductVisibility ? "red" : "blue"} onClick={() => toggleVisibility()}>Mark
            As {v?.ProductVisibility ? "Invisible" : "Visible"}</Menu.Item>
        {/*toggle active status*/}
        <Menu.Item color={v?.ProductStatus === StockStatus[0].value ? "red" : "blue"} onClick={() => toggleActive()}>Mark
            As {v?.ProductStatus === StockStatus[0].value ? "Inactive" : "Active"}</Menu.Item>
        {/*delete stock*/}
        <Menu.Item>Delete</Menu.Item>
    </Menu>
}

function StockImages({images}) {
    if (images && images.length > 0)
        return <div className="grid gap-4 grid-cols-4">{images && images.map((v, i) => <div><img src={v?.ImageUrl}
                                                                                                 className="h-full w-full object-cover rounded-lg"/>
        </div>)}</div>
    return <div>No images for now.</div>
}