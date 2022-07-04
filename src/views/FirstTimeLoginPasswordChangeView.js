import {useLocation, useHistory, useParams} from 'react-router-dom';
import Logo from '../images/dlogo.svg';
import React, {useState} from 'react';
import {TextField} from '@material-ui/core';
import {Button} from '@mantine/core';
import useAjaxError from "../Helpers/useAjaxError";
import useToasts from "../Helpers/MyToasts";
import {HashPassword} from "../Helpers/aes";
import {getAxios, postAxios} from "../Helpers/API";
import {DashboardUrl} from "../Helpers/UrlHelper";


export default function FirstTimeLoginPasswordChangeView(props) {
    const [oldPwd, setOldPwd] = useState("");
    const [newPwd, setNewPwd] = useState("");
    const [confirmNewPwd, setConfirmNewPwd] = useState("");
    const [isWorking, setIsWorking] = useState(false);
    const [ajaxError] = useAjaxError();
    const [toast] = useToasts();
    const history = useHistory();
    const location = useLocation();
    const {username, isFirstTime, token, avatar} = location.state;


    return <div className="flex items-center justify-center w-screen h-screen">
        <div
            className="w-2/4 bg-white shadow-lg rounded-lg p-4 space-y-4 mx-auto flex flex-col items-center justify-center"
            key={location.key}>
            {/*    logo*/}
            <div>
                <img src={Logo} className="h-32 w-full" alt=""/>
            </div>
            {/*avatar*/}
            <div className="border border-gray-200 p-1 rounded-full shadow-lg">
                <img src={avatar} className="h-32 w-32 rounded-full" alt=""/>
            </div>
            <div className="w-full text-center">
                <span className="text-center">Hello, it seems this is the first time you're logging in. Please change your password to continue.</span>
            </div>


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
        const result = await postAxios("auth/change/first/time/pass", payload).catch(ajaxError).finally(() => setIsWorking(false));
        if (result && result?.user) {
            localStorage.setItem("token", result.token);
            localStorage.setItem("user", result.user);
            await fetchMyProfile();
        }

    }

    async function fetchMyProfile() {
        const result = await getAxios("auth/profile").catch(ajaxError);
        if (result) {
            localStorage.setItem("r", JSON.stringify(result.Roles));
            history.replace(DashboardUrl);
        }
    }
}