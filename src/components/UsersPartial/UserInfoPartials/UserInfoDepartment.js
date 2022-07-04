import React, {useState} from "react";
import {getAxios, postAxios} from "../../../Helpers/API";
import useAjaxError from "../../../Helpers/useAjaxError";
import useToasts from "../../../Helpers/MyToasts";
import {ActionIcon, Loader, Popover, TextInput, Button, Select} from "@mantine/core";
import {Edit3} from "react-feather";
import {useFetchLovDepartments} from "../../../Hooks/SWRHooks/useLovHooks";

export default function UserInfoDepartment({data: v, mutate, title = "Update user department"}) {
    const [open, setOpen] = useState(false);
    const [isWorking, setIsWorking] = useState(false);
    const [name, setName] = useState(v?.Department);
    const [ajaxError] = useAjaxError();
    const [toast] = useToasts();

    const {data: depts} = useFetchLovDepartments();

    async function handleFinish() {
        setIsWorking(true);
        const result = await getAxios(`user/update/department?username=${v?.Username}&name=${name}`)
            .catch(ajaxError)
            .finally(() => setIsWorking(false));

        if (result) {
            mutate({...v, Department: result}, true);
            setOpen(false);
            //setName("");
            toast("User updated successfully", "success");
        }
    }


    return <div className="flex items-start space-x-6">
        <b>{v?.Department || "N/A"}</b>

        <Popover
            opened={open}
            onClose={() => setOpen(false)}
            target={<ActionIcon size={"xs"} onClick={() => setOpen((o) => !o)}><Edit3/></ActionIcon>}
            width={280}
            position="bottom"
            placement={"end"}
            withArrow
            shadow={"xl"}
        >
            <div className="border-b mb-4">
                <b>{title}</b>
            </div>
            <div className="flex flex-col space-y-2">
                <div>
                    <Select
                        data={depts || []}
                        value={name} variant="filled"
                        onChange={(e) => setName(e)}
                        placeholder="Select department"
                        label="Select department"/>
                </div>
                <div>
                    <Button onClick={() => handleFinish()} loading={isWorking} size={"xs"}>Update</Button>
                </div>
            </div>
        </Popover>
    </div>
}