import {Button, Collapse, TextInput} from '@mantine/core';
import React, {useEffect, useState} from 'react';
import {ChevronDown} from "react-feather";


export default function EditRolePartial({roleData}) {
    const [roleName, setRoleName] = useState("");
    const [isWorking, setIsWorking] = useState(false);
    const [collapse, setCollapse] = useState(false);

    useEffect(() => {
        setRoleName(roleData?.RoleName);
    }, [roleData]);

    async function handleUpdate() {
        if (!roleName) return alert("Role name is required");
        //setRoleName("");
    }


    return <div className="flex flex-col space-y-4">
        <div className="grid gap-2">
            <TextInput required variant="filled" label="Enter new role name" placeholder="Enter new role name"
                       value={roleName} onChange={(e) => setRoleName(e.target.value)}
            />
            <Button onClick={() => handleUpdate()} loading={isWorking}>Update</Button>
            <Button rightIcon={<ChevronDown/>} variant="white" color="yellow" onClick={() => setCollapse((v) => !v)}>More</Button>
        </div>

        {collapse && <div className="grid gap-2 rounded shadow border border-gray-200 p-4">
            <Button loading={isWorking} color={"red"} size={"xs"} variant={"light"}>Delete Role</Button>
            <span className="text-gray-500 text-xs"><b>Note: </b> that you will not be able to delete roles that already has active users in it. You will have to either make all these users inactive or delete them.</span>
        </div>}
    </div>
}