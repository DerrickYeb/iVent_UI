import {Button, PasswordInput, Select, TextInput} from "@mantine/core";
import React, {useState, useEffect} from "react";
import {RolesDemoData, UsersDemoData} from "../../Demo/UsersDemoData";
import {cloneDeep} from "lodash";
import {BasicModalUtils} from "../../modals/ModalUtils";

export default function ChangePasswordPartial({object, onEditDone}) {
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [isWorking, setIsWorking] = useState(false);
    const [password, setPassword] = useState("");

    useEffect(() => {
        setUsername(object?.Username);
    }, [object]);

    return <div>
        <Button size="xs" onClick={() => setOpen(true)}>Change</Button>

        {/*    new user modal  */}
        {open && <BasicModalUtils open={open} onClose={() => setOpen(false)}
                                  title={"Change Password for User - " + object?.Fullname}
                                  okBtn={<Button>Update</Button>}
        >
            <div className="grid gap-4 grid-cols-1">
                <PasswordInput value={password} variant="filled" onChange={(e) => setPassword(e.currentTarget.value)}
                               placeholder="Enter password" label="Enter password" required/>
            </div>
        </BasicModalUtils>}
    </div>
}