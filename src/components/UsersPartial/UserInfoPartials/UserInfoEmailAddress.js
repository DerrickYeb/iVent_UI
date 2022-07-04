import React, {useState} from "react";
import {getAxios} from "../../../Helpers/API";
import useAjaxError from "../../../Helpers/useAjaxError";
import useToasts from "../../../Helpers/MyToasts";
import {ActionIcon, Popover, TextInput, Button} from "@mantine/core";
import {Edit3, Mail} from "react-feather";

export default function UserInfoEmailAddress({data: v, mutate, title="Update user email address"}) {
    const [open, setOpen] = useState(false);
    const [isWorking, setIsWorking] = useState(false);
    const [name, setName] = useState(v?.EmailAddress);
    const [ajaxError] = useAjaxError();
    const [toast] = useToasts();

    async function handleFinish() {
        setIsWorking(true);
        const result = await getAxios(`user/update/email?username=${v?.Username}&name=${name}`)
            .catch(ajaxError)
            .finally(() => setIsWorking(false));

        if (result) {
            mutate({...v, EmailAddress: result}, true);
            setOpen(false);
            //setName("");
            toast("User updated successfully", "success");
        }
    }


    return <div className="flex items-start space-x-6">
        {v?.EmailAddress ? <div className="flex space-x-2 items-center"><Mail/> <a
            href={`mailto:${v?.EmailAddress}`}>{v?.EmailAddress}</a></div> : <span>Email not available</span>}

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
                    <TextInput
                        label="Enter email address"
                        placeholder="Enter email address"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant={"filled"}
                    />
                </div>
                <div>
                    <Button onClick={() => handleFinish()} loading={isWorking} size={"xs"}>Update</Button>
                </div>
            </div>
        </Popover>
    </div>
}