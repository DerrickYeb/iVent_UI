import useAjaxError from "../../Helpers/useAjaxError";
import useToasts from "../../Helpers/MyToasts";
import React, {useState} from "react";
import {useRecoilState} from "recoil";
import {UsersListStore} from "../../Store/Store";
import {Button, TextInput, Badge, PasswordInput, Select, Loader} from '@mantine/core';
import {BasicModalUtils} from "../../modals/ModalUtils";
import {useFetchLovDepartments, useFetchLovDesignations} from "../../Hooks/SWRHooks/useLovHooks";
import DefaultUserImg from '../../images/avatar.png';
import {fileValidator} from "../../Helpers/FileValidator";
import {getAxios, postAxios} from "../../Helpers/API";
import {Plus} from "react-feather";
import {HashPassword} from "../../Helpers/aes";
import {UsersTypeArr} from "../../Helpers/Constants";


export default function NewUserPartial() {
    const [ajaxError] = useAjaxError();
    const [toast] = useToasts();
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setphone] = useState("");
    const [department, setDepartment] = useState("");
    const [designation, setDesignation] = useState("");
    const [avatar, setAvatar] = useState(DefaultUserImg);
    const [password, setPassword] = useState("");
    const [userType, setUserType] = useState("Staff");
    const [status, setStatus] = useState(true);
    const [isWorking, setIsWorking] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [users, setUsers] = useRecoilState(UsersListStore);

    const {data: depts} = useFetchLovDepartments();
    const {data: desgn} = useFetchLovDesignations();

    async function handleSave() {
        if (!username) return toast("Username is required");
        if (!password) return toast("Password is required");
        if (!fullname) return toast("Fullname is required");

        setIsWorking(true);
        let payload = {
            Username: username,
            Password: HashPassword(password),
            Fullname: fullname,
            Avatar: avatar,
            UserType: userType,
            EmailAddress: email,
            PhoneNumber: phone,
            Department: department,
            Designation: designation
        };
        const result = await postAxios("users/new/user", payload).catch(ajaxError).finally(() => setIsWorking(false));
        if (result) {
            delete result.Roles;
            setUsers((prev) => [result, ...prev]);
            setOpen(false);
            toast("New user added successfully")
        }
    }

    async function handleUploadFile(file) {
        const currentFile = file.target.files;
        const val = fileValidator(currentFile);
        if (val.state === false) {
            toast(val.payload, "info");
            return;
        }

        setIsUploading(true);
        let reader = new FileReader();
        reader.onload = function (e) {
            uploadFile(e.target.result);
        };
        reader.onerror = function (err) {
            toast("Error in reading selected file", "error");
            setIsUploading(false);
        };
        reader.readAsDataURL(currentFile[0]);
    }

    //upload file
    async function uploadFile(file) {
        let payload = {
            FileUrl: file,
        };
        setIsUploading(true);
        const result = await postAxios("upload/file", payload).catch((err) => {
            ajaxError(err);
            setIsUploading(false);
        });
        if (result) {
            setIsUploading(false);
            setAvatar(result?.secure_url);
        }
    }


    return <React.Fragment>
        <Button
            leftIcon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                           viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
            </svg>
            } size="sm"
            onClick={() => setOpen(true)}
        >New User</Button>

        {/*    new user modal  */}
        {open && <BasicModalUtils open={open} onClose={() => setOpen(false)} title="New User"
                                  okBtn={<Button loading={isWorking} onClick={() => handleSave()}>Save</Button>}
        >

            {/*avatar*/}
            <div className="w-full mx-auto flex items-center justify-center p-4">
                <div className="border border-gray-200 p-1 rounded-full">
                    {isUploading ? (
                        <div className="h-24 w-24 flex items-center justify-center">
                            <Loader variant="dots" size="lg" color="teal"/>
                        </div>
                    ) : (
                        <div>
                            <input
                                id="upd1u"
                                type="file"
                                accept="image/png,image/gif,image/jpeg,image/webp"
                                onChange={(e) => handleUploadFile(e)}
                                onClick={(event) => {
                                    event.target.value = null;
                                }}
                            />
                            <label htmlFor="upd1u">
                                <img src={avatar} className="h-24 w-24 object-cover rounded-full" alt=""/>
                            </label>
                        </div>
                    )}

                </div>
            </div>

            <div className="grid gap-4 grid-cols-2">
                <div>
                    <TextInput value={username} variant="filled" onChange={(e) => setUsername(e.target.value)}
                               placeholder="Enter username" label="Enter username" required/>
                </div>
                <div>
                    <PasswordInput value={password} variant="filled"
                                   onChange={(e) => setPassword(e.currentTarget.value)}
                                   placeholder="Enter password" label="Enter password" required/>
                </div>

                <div>
                    <TextInput value={fullname} variant="filled" onChange={(e) => setFullname(e.target.value)}
                               placeholder="Enter fullname" label="Enter fullname" required/>
                </div>

                <div>
                    <TextInput value={email} variant="filled" onChange={(e) => setEmail(e.target.value)}
                               placeholder="Enter email address" label="Enter email address"/>
                </div>

                <div>
                    <TextInput value={phone} variant="filled" onChange={(e) => setphone(e.target.value)}
                               placeholder="Enter phone no" label="Enter phone no"/>
                </div>

                <div>
                    <Select data={depts || []} value={department} variant="filled" onChange={(e) => setDepartment(e)}
                            placeholder="Select user department" label="Select user department"/>
                </div>

                <div>
                    <Select data={desgn || []} value={designation} variant="filled" onChange={(e) => setDesignation(e)}
                            placeholder="Select user designation" label="Select user designation"/>
                </div>

                <div>
                    <Select data={UsersTypeArr} value={userType} variant="filled" onChange={(e) => setUserType(e)}
                            placeholder="Select user type" label="Select user type"/>
                </div>

            </div>
        </BasicModalUtils>}
    </React.Fragment>
}