import {Button, Loader} from "@mantine/core";
import {Plus} from "react-feather";
import SideMenu from "../Helpers/SideMenu";
import PartialHeader from "../Helpers/PartialHeader";
import SettingsSvg from "../Svgicons/SettingsSvg";
import {GridHelper} from "../Helpers/GridHelper";
import {ColumnDirective, ColumnsDirective} from "@syncfusion/ej2-react-grids";
import React, {useState, useEffect} from "react";
import RolesManagementPartial from "../components/RolesPartial/RolesManagementPartial";
import NewRolePartial from "../components/RolesPartial/NewRolePartial";
import {RolesListStore} from "../Store/Store";
import {useRecoilState} from "recoil";
import {getAxios} from "../Helpers/API";
import useAjaxError from "../Helpers/useAjaxError";

export default function ViewRolesManagement() {
    const [data, setData] = useRecoilState(RolesListStore);
    const [open, setOpen] = useState(false);
    const [ajaxError] = useAjaxError();

    async function fetchData() {
        const result = await getAxios("roles/get/roles").catch(ajaxError);
        if (result && Array.isArray(result)) {
            setData(result);
        }
    }

    useEffect(() => {
        if (data.length > 0) return;
        fetchData()
    }, [])


    return <SideMenu>
        <PartialHeader icon={<SettingsSvg/>} title="Setups > Roles Management"/>
        <div className="p-4 bg-white shadow w-full mx-auto mb-4">
            <div className="flex justify-end mb-4"><Button leftIcon={<Plus/>} onClick={() => setOpen(true)}>New
                Role</Button>
            </div>

            {/*    roles list grid*/}
            {data && data.length > 0 ? <GridHelper data={data} pageCount={6}>
                <ColumnsDirective>
                    <ColumnDirective
                        field="RoleId"
                        width="100"
                        isPrimaryKey
                        visible={false}
                    />
                    <ColumnDirective
                        field="RoleGroup"
                        headerText="Role Group"
                        width="180"
                        //isFrozen
                    />
                    <ColumnDirective
                        field="RoleName"
                        headerText="Role Name"
                        width="180"
                        //isFrozen
                    />
                    {/*<ColumnDirective*/}
                    {/*    field="UsersInRole"*/}
                    {/*    headerText="No. Of Users"*/}
                    {/*    width="100"*/}
                    {/*/>*/}
                    <ColumnDirective
                        field="Dated"
                        headerText="Date Entered"
                        width="150"
                        format={"yMd"}
                        type={"datetime"}
                    />
                    <ColumnDirective
                        field="EnteredBy"
                        headerText="Entered By"
                        width="150"
                    />
                    <ColumnDirective
                        headerText="Action"
                        width="80"
                        template={viewTemplate}
                        allowSearching={false}
                    />
                </ColumnsDirective>
            </GridHelper> : <div className="bg-white p-24 flex items-center justify-center mx-auto">
                <Loader/>
            </div>}
        </div>

        {/*    new role modal*/}
        <NewRolePartial onDone={(obj) => handleOnNewRoleDone(obj)} open={open} onClose={() => setOpen(false)}/>
    </SideMenu>

    function viewTemplate(props) {
        return (
            <RolesManagementPartial
                object={props}
                // onEditDone={(data) => onEditDone(data)}
            />
        );
    }

    function handleOnNewRoleDone(obj) {
        setData(prev => [...prev, obj])
    }
}