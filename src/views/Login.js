import React, {useState} from "react";
import {PasswordInput, TextInput, Button} from "@mantine/core";
import LeftImg from '../images/box.svg';
import LogoImg from '../images/dlogo.svg';
import {useHistory} from "react-router-dom";
import {DashboardUrl} from "../Helpers/UrlHelper";
import useAjaxError from "../Helpers/useAjaxError";
import {getAxios, LoginApi} from "../Helpers/API";
import {HashPassword} from "../Helpers/aes";

export default function Login() {
    const [username, setUsername] = useState("");
    const [isWorking, setIsWorking] = useState(false);
    const [pwd, setPwd] = useState("");
    const history = useHistory();
    const [ajaxError] = useAjaxError();

    async function handleLogin() {
        setIsWorking(true);
        LoginApi(username, HashPassword(pwd))
            .then((res) => {
                if (res?.user) {
                    setIsWorking(false);
                    if (res?.isFirstTime === true) return history.push({
                        pathname: "/first/password/change",
                        state: {
                            username: res?.user,
                            isFirstTime: res?.isFirstTime,
                            token: res?.token,
                            avatar: res?.avatar
                        }
                    })
                    localStorage.setItem("token", res.token);
                    localStorage.setItem("user", res.user);
                    fetchMyProfile();
                }
            })
            .catch((err) => {
                setIsWorking(false);
                ajaxError(err);
            });
    }

    async function fetchMyProfile() {
        const result = await getAxios("auth/profile").catch(ajaxError);
        if (result) {
            localStorage.setItem("r", JSON.stringify(result.Roles));
            history.replace(DashboardUrl);
        }
    }

    return (
        <div className="w-screen flex h-screen">
            <div className="w-2/5 flex-grow flex items-center justify-center p-8 bg-white">

                <div className="flex flex-col space-y-2 w-full">
                    <div className="-mt-20 mx-auto">
                        <img src='' alt="Logo here" className="object-cover w-80"/>
                    </div>
                    <div className="pb-16 mx-auto font-semibold text-2xl">
                        <h2>Inventory Management System</h2>
                    </div>
                    <TextInput
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        variant="filled"
                        size="md"
                        placeholder="Enter username or enter test as guest username"
                        label="Enter username"
                        required
                    />

                    <PasswordInput
                        placeholder="Enter password or enter test as guest password"
                        label="Enter password"
                        value={pwd}
                        onChange={(e) => setPwd(e.currentTarget.value)}
                        variant="filled"
                        size="md"
                        required
                    />
                    <Button  loading={isWorking} onClick={() => handleLogin()}>Login</Button>
                </div>
            </div>
            <div className="flex-none w-3/5 bg-auto bg-no-repeat bg-center bg-gray-100" style={{
                backgroundImage: `url(${LeftImg})`
            }}>

            </div>
        </div>
    );
}
