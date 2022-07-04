import SideMenu from "../Helpers/SideMenu";
import PartialHeader from "../Helpers/PartialHeader";
import InventorySvg from "../Svgicons/InventorySvg";
import {ActionIcon, Badge, Button, Menu, Loader} from "@mantine/core";
import {ChevronDown, Plus, Settings, XCircle} from "react-feather";
import React, {useEffect, useState} from "react";
import {StocksListStore} from "../Store/Store";
import {useRecoilState} from "recoil";
import {StockStatus} from "../Helpers/Constants";
import useAjaxError from "../Helpers/useAjaxError";
import {getAxios} from "../Helpers/API";
import {useHistory} from "react-router-dom";
import {AllInventoryUrl, EditSingleStockUrl, NewInventoryUrl} from "../Helpers/UrlHelper";
import {GridHelper} from "../Helpers/GridHelper";
import {ColumnDirective, ColumnsDirective} from "@syncfusion/ej2-react-grids";
import {BasicRightDrawerUtils} from "../modals/ModalUtils";
import MEventEmitter from "../Helpers/MEventEmitter";
import {cloneDeep} from "lodash";
import StockDetails from "../components/StockPartials/StockDetails";

export default function ViewAllInventory() {
    const [stocks, setStocks] = useRecoilState(StocksListStore);
    const [stock, setStock] = useState(null);
    const [open, setOpen] = useState(false);
    const [stocksByCategory, setStocksByCategory] = useState([]);
    const [selectedCategoryName, setSelectedCategoryName] = useState("");
    const [openDrawer, setOpenDrawer] = useState(false);
    const [status, setStatus] = useState("");
    const [ajaxError] = useAjaxError();
    const history = useHistory();

    const cloneArr = cloneDeep(stocks);

    async function fetchStocks() {
        const result = await getAxios(`stocks/get/stocks?stockStatus=${status}`).catch(ajaxError);
        if (result) setStocks(result);
    }

    async function fetchStocksByStatus() {
        const result = await getAxios(`stocks/get/stocks?stockStatus=${status}`).catch(ajaxError);
        if (result) setStocks(result);
    }

    useEffect(() => {
        //if (!status) return;
        fetchStocksByStatus();
    }, [status])


    function handleOnStockStatusChange(status) {
        setStatus(status);
    }

    useEffect(() => {
        if (stocks.length > 0) return;
        fetchStocks();
    }, [])

    useEffect(() => {
        // stocks update events emitter
        MEventEmitter.on('stockUpdated', (data) => {
            const arr = [...stocks];
            const findIndex = arr.findIndex((x) => x.ProductId === data?.ProductId);
            if (findIndex !== -1) {
                arr[findIndex] = data;
                setStocks(arr);
            }
        })
        return () => {
            // MEventEmitter.remove('stockUpdated', () => {
            // })
        }
    }, [stocks]);

    // async function handleLoadStocksByCategory(value, name) {
    //     setSelectedCategoryName(name)
    //     //check if category stocks has stocks with this selected category
    //     const check = stocksByCategory.filter((x) => x.ProductCategoryId === value);
    //     if (check.length > 0) {
    //         setOpenDrawer(true);
    //     } else {
    //         //fetch stocks by category
    //         setOpenDrawer(false);
    //         const result = await getAxios(`stocks/get/stocks/by/category?categoryId=${value}`).catch(ajaxError);
    //         if (result) setStocksByCategory(result);
    //         setOpenDrawer(true)
    //     }
    // }


    return <SideMenu title="All Stocks">
        <PartialHeader title="Stocks" icon={<InventorySvg/>}/>
        <div className="w-full border-t border-gray-200">
            {/*top bar to toggle show all items, new stock button at the top right and others*/}
            <div className="flex items-center justify-between bg-white p-2">
                <div className="flex items-center space-x-4">
                    <Menu withArrow={true} position={"bottom"} trigger="click" delay={500}
                          control={<div
                              className="flex items-center justify-between space-x-2 rounded bg-gray-50 p-1">
                              <b>All Stocks</b>
                              <ChevronDown/>
                          </div>}
                    >
                        {/*<Menu.Item onClick={() => alert("hello")}>All Stocks</Menu.Item>*/}
                        {StockStatus.map((s, i) => <Menu.Item
                            onClick={() => handleOnStockStatusChange(s?.value)} key={s?.label}>{s?.label}</Menu.Item>)}
                    </Menu>
                    <div>
                        <Button color="yellow" size="xs" variant="outline">Hidden Products</Button>
                        <Button size="xs" variant="subtle">By Categories</Button>
                        <Button size="xs" variant="subtle">By Brands</Button>
                        <Button size="xs" variant="subtle">By Manufacturers</Button>
                        <Button size="xs" variant="subtle">By Suppliers</Button>
                        {/*<SegmentedControl data={["one", "two"]}/>*/}
                    </div>
                </div>
                <div className="flex items-center space-x-6 pr-2">
                    <Button onClick={() => history.push(NewInventoryUrl)} className="bg-green-500" leftIcon={<Plus/>}
                            size={"xs"}>New</Button>
                    {/*<ActionIcon>*/}
                    {/*    <Settings/>*/}
                    {/*</ActionIcon>*/}
                </div>
            </div>
            {/*top bar end*/}

            {/*    main stocks list grid*/}
            <div className="p-2">
                {stocks && stocks.length > 0 ? <GridHelper
                    exportTplList={[
                        {text: "Cost Price", value: "ProductCostPrice"},
                        {text: "Selling Price", value: "ProductSellingPrice"},
                        {text: "Status", value: "ProductStatus"}
                    ]} data={stocks} height={330}>
                    <ColumnsDirective>
                        <ColumnDirective field="ProductId" headerText="ProductId" visible={false} isPrimaryKey/>
                        <ColumnDirective field="ProductName" headerText="Stock Name"/>
                        <ColumnDirective field="ProductOpeningStockQty" headerText="Open. Stock"/>
                        <ColumnDirective field="ProductQuantityAtHand" headerText="Curr. Stock"/>
                        <ColumnDirective field="ProductSKU" headerText="Batch No"/>
                        <ColumnDirective template={costPriceTpl} headerText="Cost Price" allowSearching={false}/>
                        <ColumnDirective template={sellingPriceTpl} headerText="Selling Price" allowSearching={false}/>


                        {/*<ColumnDirective field="Category" headerText="Category"/>*/}
                        {/*<ColumnDirective template={categoryTpl} headerText="Category" allowSearching={false}/>*/}
                        <ColumnDirective template={statusTpl} headerText="Status" allowSearching={false}/>
                        {/*<ColumnDirective field="ProductExpireDate" headerText="Expiring Date" format={"yMd"}*/}
                        {/*                 datatype="date"/>*/}
                        {/*<ColumnDirective field="ProductManufactureDate" headerText="Manu. Date" format={"yMd"}*/}
                        {/*                 datatype="date" />*/}
                        <ColumnDirective template={actionTpl} headerText="Action" allowSearching={false}/>
                    </ColumnsDirective>
                </GridHelper> : <div>Trying to fetch stocks... Please wait.</div>}
            </div>


            {/*    sidebar drawer to show stocks in a category*/}
            {/*<BasicRightDrawerUtils open={openDrawer} onClose={() => setOpenDrawer(false)} size={870}>*/}
            {/*    <div className="p-2 h-screen flex flex-col justify-between">*/}
            {/*        <div>*/}
            {/*            <div className="flex items-center justify-between mb-2">*/}
            {/*                <span*/}
            {/*                    className="font-medium text-gray-700 text-xl">Stocks under <b>{selectedCategoryName}</b> category</span>*/}
            {/*                <ActionIcon onClick={() => setOpenDrawer(false)}>*/}
            {/*                    <XCircle className="text-red-400"/>*/}
            {/*                </ActionIcon>*/}
            {/*            </div>*/}
            {/*            <GridHelper data={stocksByCategory}>*/}
            {/*                <ColumnsDirective>*/}
            {/*                    <ColumnDirective field="ProductId" headerText="ProductId" visible={false} isPrimaryKey/>*/}
            {/*                    <ColumnDirective field="ProductSKU" headerText="Batch No" width={120}/>*/}
            {/*                    <ColumnDirective field="ProductName" headerText="Stock Name" width={200}/>*/}
            {/*                    <ColumnDirective template={costPriceTpl} headerText="Cost Price" allowSearching={false}*/}
            {/*                                     width={130}/>*/}
            {/*                    <ColumnDirective template={sellingPriceTpl} headerText="Selling Price"*/}
            {/*                                     allowSearching={false}*/}
            {/*                                     width={150}/>*/}
            {/*                    <ColumnDirective field="ProductOpeningStockQty" headerText="Stock Qty." width={150}/>*/}
            {/*                    <ColumnDirective field="ProductQuantityAtHand" headerText="Remaining Qty." width={160}/>*/}
            {/*                    <ColumnDirective template={statusTpl} headerText="Status" allowSearching={false}*/}
            {/*                                     width={100}/>*/}
            {/*                    <ColumnDirective field="ProductExpireDate" headerText="Expiring Date" format={"yMd"}*/}
            {/*                                     datatype="date"*/}
            {/*                                     width={150}/>*/}
            {/*                    <ColumnDirective field="ProductManufactureDate" headerText="Manu. Date"*/}
            {/*                                     format={"yMd"}*/}
            {/*                                     datatype="date" width={150}/>*/}
            {/*                    <ColumnDirective template={actionTpl} headerText="Action" allowSearching={false}*/}
            {/*                                     width={100}/>*/}
            {/*                </ColumnsDirective>*/}
            {/*            </GridHelper>*/}
            {/*        </div>*/}
            {/*        <div className="w-full">*/}
            {/*            <Button>View more</Button>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</BasicRightDrawerUtils>*/}
        </div>

        <StockDetails object={stock} open={open} onClose={() => setOpen(false)}/>
    </SideMenu>

    // function categoryTpl(props) {
    //     return <Button variant="subtle" size={"xs"}
    //                    onClick={() => handleLoadStocksByCategory(props?.ProductCategoryId, props?.Category)}>{props?.Category}</Button>
    // }

    function statusTpl(props) {
        return <Badge
            radius={0}
            color={`${props?.ProductStatus === StockStatus[2].label ? "red" : props?.ProductStatus === StockStatus[3].label ? "red" : "teal"}`}>{props?.ProductStatus}</Badge>
    }

    function actionTpl(props) {
        return <Button variant="white" size={"xs"} onClick={() => {
            setStock(props);
            setOpen(true);
        }}>View</Button>

        // return <Button size="xs" variant="light" color="teal"
        //                onClick={() => history.push(EditSingleStockUrl + props?.ProductId)}>View</Button>
    }

    function costPriceTpl(props) {
        return (<div>GHC{props?.ProductCostPrice}</div>)
    }

    function sellingPriceTpl(props) {
        return <span>GHC{props?.ProductSellingPrice}</span>
    }
}