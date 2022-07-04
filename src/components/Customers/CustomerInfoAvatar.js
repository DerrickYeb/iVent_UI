import {fileValidator} from "../../Helpers/FileValidator";
import React, {useState} from "react";
import {getAxios, postAxios} from "../../Helpers/API";
import {Avatar, Loader} from "@mantine/core";
import AvatarImg from "../../images/avatar.png";
import useAjaxError from "../../Helpers/useAjaxError";
import useToasts from "../../Helpers/MyToasts";

export default function CustomerInfoAvatar({data: v, onDone}) {
    const [isUploading, setIsUploading] = useState(false);
    const [ajaxError] = useAjaxError();
    const [toast] = useToasts();


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
            await updateCustomerAvatar(result?.secure_url);
        }
    }

    async function updateCustomerAvatar(fileUrl) {
        const result = await getAxios(`customers/update/customer/avatar?customerId=${v?.CustomerId}&url=${fileUrl}`).catch(ajaxError);
        if (result) onDone(result);
    }

    return <div className="p-1 cursor-pointer">
        {isUploading ? (
            <div className="flex items-center justify-center" style={{
                height: 150,
                width: 150
            }}>
                <Loader variant="dots" size="lg" color="teal"/>
            </div>
        ) : (
            <div>
                <input
                    id="upd1uc"
                    type="file"
                    accept="image/png,image/gif,image/jpeg,image/webp"
                    onChange={(e) => handleUploadFile(e)}
                    onClick={(event) => {
                        event.target.value = null;
                    }}
                />
                <label htmlFor="upd1uc">
                    <Avatar src={v?.CustomerAvatar || AvatarImg} radius={1} size={150}/>
                </label>
            </div>
        )}

    </div>
}