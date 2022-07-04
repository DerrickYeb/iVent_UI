import {Button, Badge, Tabs} from "@mantine/core";
import {useState} from "react";
import {BasicModalUtils} from "../../modals/ModalUtils";
import EditRolePartial from "./EditRolePartial";
import AddUsersToRolePartial from "./AddUsersToRolePartial";
import RemoveUsersFromRolePartial from "./RemoveUsersFromRolePartial";

export default function RolesManagementPartial({object}) {
    const [openModal, setOpenModal] = useState(false);
    return <div>
        <Button size="xs" onClick={() => setOpenModal(true)}>Edit</Button>

        {/*    roles management modal*/}
        <BasicModalUtils title={"Managing " + object?.RoleName} open={openModal} onClose={() => setOpenModal(false)}>

            {/*    tabs*/}
            <Tabs grow>
                <Tabs.Tab label="Edit/Delete Role">
                    <EditRolePartial roleData={object}/>
                </Tabs.Tab>
                {/*<Tabs.Tab label="Add User(s)">*/}
                {/*    <AddUsersToRolePartial roleData={object}/>*/}
                {/*</Tabs.Tab>*/}
                {/*<Tabs.Tab label="Remove User(s)">*/}
                {/*    <RemoveUsersFromRolePartial roleData={object}/>*/}
                {/*</Tabs.Tab>*/}
            </Tabs>
        </BasicModalUtils>
    </div>
}