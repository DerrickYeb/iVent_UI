import DefaultUserImg from "../../../images/avatar.png";
import React, {useEffect, useState} from "react";
import {fileValidator} from "../../../Helpers/FileValidator";
import {getAxios, postAxios} from "../../../Helpers/API";
import useAjaxError from "../../../Helpers/useAjaxError";
import useToasts from "../../../Helpers/MyToasts";
import {ActionIcon, Loader} from "@mantine/core";
import {Edit3} from "react-feather";
import  { useSWRConfig } from 'swr'


export default function UserInfoAvatar({data: v, mutate, mutateProfile = false}) {
    const [showEdit, setShowEdit] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [ajaxError] = useAjaxError();
    const [toast] = useToasts();
    //const { mutate:mutateMe } = useSWRConfig()


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
            const updatePic = await getAxios(`user/update/avatar?username=${v?.Username}&avatarUrl=${result?.secure_url}`).catch(ajaxError);
            if(updatePic) mutate({...v, Avatar:updatePic}, true);
          // if(mutateProfile) await mutateMe("auth/profile", true);
        }
    }


    return <div className="border-2 border-green-500 cursor-pointer hover:opacity-95 rounded-full p-1 relative">

        {isUploading ? (
            <div className="h-32 w-32 flex items-center justify-center">
                <Loader variant="dots" size="lg" color="teal"/>
            </div>
        ) : (
            <div>
                <input
                    id="upd1edt"
                    type="file"
                    accept="image/png,image/gif,image/jpeg,image/webp"
                    onChange={(e) => handleUploadFile(e)}
                    onClick={(event) => {
                        event.target.value = null;
                    }}
                />
                <label htmlFor="upd1edt">
                    <img src={v?.Avatar || DefaultUserImg} className="cursor-pointer hover:opacity-95 rounded-full w-32 h-32 object-cover" alt=""/>
                </label>
            </div>
        )}
    </div>
}