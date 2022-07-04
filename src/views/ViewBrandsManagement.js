import SideMenu from "../Helpers/SideMenu";
import PartialHeader from "../Helpers/PartialHeader";
import InventorySvg from "../Svgicons/InventorySvg";
import React, {useState, useEffect} from "react";
import {ActionIcon, Button, Collapse, TextInput, Loader} from "@mantine/core";
import {Plus, Settings} from "react-feather";
import {ColumnDirective, ColumnsDirective} from "@syncfusion/ej2-react-grids";
import {GridHelper} from "../Helpers/GridHelper";
import useAjaxError from "../Helpers/useAjaxError";
import useToasts from "../Helpers/MyToasts";
import {getAxios, postAxios} from "../Helpers/API";
import DOMPurify from "dompurify";
import {BasicModalUtils} from "../modals/ModalUtils";
import {cloneDeep} from "lodash";

export default function ViewBrandsManagement() {
    const [data, setData] = useState([]);
    const [collapse, setCollapse] = useState(false);
    const [open, setOpen] = useState(false);
    const [isWorking, setIsWorking] = useState(false);
    const [ajaxError] = useAjaxError();
    const [toast] = useToasts();
    const [name, setName] = useState("");
    const [selectedId, setSelectedId] = useState("");

    const cloneArr = cloneDeep(data);

    async function fetchData() {
        const result = await getAxios(`brands/get/brands`).catch(ajaxError);
        if (result) {
            //const joinArr = data.concat(result);
            setData(data.concat(result));
        }
    }

    useEffect(() => {
        if (data.length > 0) return;
        fetchData();
    }, [])


    async function handleSaveNew() {
        if (!name) return toast("Brand name is required", "info");
        let payload = {
            CategoryName: DOMPurify.sanitize(name)
        }
        setIsWorking(true);
        const result = await postAxios("brands/new/brand", payload).catch((err) => {
            setIsWorking(false);
            ajaxError(err);
        })
        if (result) {
            setIsWorking(false);
            setName("");
            toast("Added successfully", "success");
            setData((prev) => [result, ...prev])
        }
    }

    function handleSetForUpdate(id, name) {
        setSelectedId(id);
        setName(name);
        setOpen(true)
    }

    async function handleOnUpdate() {
        if (!selectedId) return toast("Cannot get a reference to edit", "info");
        if (!name) return toast("Brand name is required", "info");
        setIsWorking(true);
        const result = await getAxios(`brands/update/brand?id=${selectedId}&name=${DOMPurify.sanitize(name)}`).catch((err) => {
            setIsWorking(false);
            ajaxError(err);
        })
        if (result) {
            setIsWorking(false);
            setName("");
            toast("Updated successfully", "success");
            //setData((prev) => prev.CategoryId !== selectedId);
            const findIndex = data.findIndex((x) => x.BrandId === selectedId);
            if (findIndex !== -1) {
                cloneArr[findIndex].BrandName = DOMPurify.sanitize(name);
                setData(cloneArr);
                setOpen(false)
            }
        }
    }

    return <SideMenu>
        <PartialHeader title="Brands Management" icon={<InventorySvg/>}/>
        <div className="w-full border-t border-gray-200">
            <div>
                <div className="p-2 flex items-center justify-end space-x-4 bg-white">
                    <Button size="xs" leftIcon={<Plus/>} onClick={() => setCollapse((v) => !v)}>New</Button>
                    <ActionIcon>
                        <Settings/>
                    </ActionIcon>
                </div>
                <Collapse in={collapse}>
                    <div className="p-4 bg-white border-t">
                        <div className="flex items-start space-x-4 w-full">
                            <div>
                                <TextInput placeholder="Enter brand name"
                                           variant="filled" value={name} onChange={(e) => setName(e.target.value)}
                                           required={true}/>
                            </div>
                            <div>
                                <Button loading={isWorking} onClick={() => handleSaveNew()}>Save</Button>
                            </div>
                        </div>

                    </div>
                </Collapse>
                {data && data.length > 0 ? <GridHelper data={data}>
                    <ColumnsDirective>
                        <ColumnDirective field="BrandId" headerText="BrandId" visible={false} isPrimaryKey/>
                        <ColumnDirective field="BrandName" headerText="Brand Name"/>
                        {/*<ColumnDirective template={categoryTpl} headerText="Products Count" allowSearching={false}/>*/}
                        <ColumnDirective field="EnteredBy" headerText="Entered By"/>
                        <ColumnDirective field="Dated" headerText="Date" format={"yMd"} datatype="date"/>
                        <ColumnDirective template={actionTpl} headerText="Action" allowSearching={false}/>
                    </ColumnsDirective>
                </GridHelper> : <Loader/>}
            </div>
        </div>

        {/*    update modal */}
        <BasicModalUtils open={open} onClose={() => setOpen(false)} title="Update category" size="xs"
                         okBtn={<Button loading={isWorking} size={"xs"}
                                        onClick={() => handleOnUpdate()}>Update</Button>}>
            <div className="flex flex-col items-center w-full">
                <div className="w-full">
                    <TextInput variant={"filled"} placeholder="Enter category name" label="Enter category name"
                               value={name} onChange={(e) => setName(e.target.value)}/>
                </div>
            </div>
        </BasicModalUtils>
    </SideMenu>

    function actionTpl(props) {
        return <Button size="xs" variant="light" color="teal"
                       onClick={() => handleSetForUpdate(props?.BrandId, props?.BrandName)}
        >Edit</Button>
    }

    function categoryTpl(props) {
        return <Button variant="subtle" size={"xs"}
            // onClick={() => handleLoadStocksByCategory(props?.ProductCategoryId, props?.Category)}
        >{props?.ProductsCount}</Button>
    }
}