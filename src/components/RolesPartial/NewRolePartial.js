import {BasicModalUtils} from "../../modals/ModalUtils";
import {Button, TextInput, Select} from "@mantine/core";
import {useState, useMemo} from "react";
import useAjaxError from "../../Helpers/useAjaxError";
import useToasts from "../../Helpers/MyToasts";
import useSWR from "swr";
import {getAxios, postAxios} from "../../Helpers/API";
import {isEmpty} from 'lodash';


export default function NewRolePartial({open, onClose, onDone}) {
    const [roleName, setRoleName] = useState("");
    const [roleGroup, setRoleGroup] = useState("");
    const [isWorking, setIsWorking] = useState(false);
    const [ajaxError] = useAjaxError();
    const [toast] = useToasts();

    const {data: rolesGroup, mutate, error} = useSWR(`get/roles/group/lov`, getAxios);

   // const memoRolesGroup = useMemo(() => !isEmpty(rolesGroup) ? rolesGroup : [], );

    async function handleAdd() {
        if (!roleName) return alert("Role name is required");
        if (!roleGroup) return alert("Role group is required");

        let payload = {
            RoleName: roleName,
            RoleGroup: roleGroup
        }
        setIsWorking(true);
        const result = await postAxios(`roles/new/role`, payload).catch(ajaxError).finally(() => setIsWorking(false));
        if(result){
            onClose();
            onDone(result);
            setRoleName("");
        }

    }

    return <BasicModalUtils title="New Role" open={open} onClose={onClose}
                            okBtn={<Button onClick={() => handleAdd()} loading={isWorking}>Save</Button>} size="xs">
        <div className="flex flex-col space-y-4">
            <TextInput required variant="filled" label="Enter new role name" placeholder="Enter new role name"
                       value={roleName} onChange={(e) => setRoleName(e.target.value)}
                       description="You will be able to add or remove users later."/>

            <Select data={rolesGroup || []} required variant="filled" label="Select role group"
                    placeholder="Select role group" value={roleGroup} onChange={(e) => setRoleGroup(e)}
            />
        </div>

    </BasicModalUtils>
}