import {useLocation, useHistory} from 'react-router-dom';
import React, {useState} from 'react';
import {TextField} from '@material-ui/core';
import {Button} from '@mantine/core';
import useAjaxError from "../../Helpers/useAjaxError";
import useToasts from "../../Helpers/MyToasts";
import {HashPassword} from "../../Helpers/aes";
import {postAxios} from "../../Helpers/API";


export default function MyProfileChangePassword({username}) {
    const [oldPwd, setOldPwd] = useState("");
    const [newPwd, setNewPwd] = useState("");
    const [confirmNewPwd, setConfirmNewPwd] = useState("");
    const [isWorking, setIsWorking] = useState(false);
    const [ajaxError] = useAjaxError();
    const [toast] = useToasts();
    const history = useHistory();
    const location = useLocation();


    return <div
        className="space-y-4 mx-auto flex flex-col items-center justify-center">

        {/*    enter old pwd*/}
        <div className="w-full">
            <TextField
                label="Enter old password"
                value={oldPwd}
                onChange={(e) => setOldPwd(e.target.value)} placeholder="Enter old password"
                color={"primary"}
                required={true}
                variant={"outlined"}
                fullWidth={true}
                type={"password"}
                autoComplete="false"
            />
        </div>

        {/*    new pwd and confirm new pwd*/}
        <div className="w-full flex items-center space-x-4">
            <div className="flex-grow">
                <TextField
                    label="Enter new password"
                    value={newPwd}
                    type={"password"}
                    onChange={(e) => setNewPwd(e.target.value)} placeholder="Enter new password"
                    color={"primary"}
                    required={true}
                    variant={"outlined"}
                    fullWidth={true}
                />
            </div>
            <div className="flex-grow">
                <TextField
                    label="Confirm new password"
                    value={confirmNewPwd}
                    onChange={(e) => setConfirmNewPwd(e.target.value)} placeholder="Confirm new password"
                    color={"primary"}
                    required={true}
                    variant={"outlined"}
                    fullWidth={true}
                    type={"password"}
                />
            </div>
        </div>

        {/*    finish button*/}
        <div className="w-full flex justify-end">
            <Button loading={isWorking} size={"lg"} onClick={() => handleFinish()}>Change</Button>
        </div>
    </div>


    async function handleFinish() {
        if (newPwd !== confirmNewPwd) return toast("Password confirmation does not match");
        if (!oldPwd) return toast("Old password field is required");
        if (!newPwd) return toast("New password field is required");
        if (newPwd === oldPwd) return toast("New password should be different from old password");
        //else go ahead and save
        let payload = {
            Username: username,
            OldPassword: HashPassword(oldPwd),
            NewPassword: HashPassword(newPwd)
        }
        setIsWorking(true);
        const result = await postAxios("auth/change/password", payload).catch(ajaxError).finally(() => setIsWorking(false));
        if (result) {
            toast("Password changed successfully", "success");
        }
    }
}