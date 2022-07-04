import {
    fileValidator,
} from "../../Helpers/FileValidator";
import {useState} from "react";
import useToasts from "../../Helpers/MyToasts";
import useAjaxError from "../../Helpers/useAjaxError";
import {postAxios} from "../../Helpers/API";
import {Upload, Paperclip, TrashX} from "tabler-icons-react";
import {Button, Loader} from '@mantine/core';
import {Popover} from "@mantine/core";

export default function NewPaymentAttachFiles({data, onDone, onRemove}){
    const [opened, setOpened] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [toast] = useToasts();
    const [ajaxError] = useAjaxError();

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
            if (onDone) onDone(result?.secure_url);
        }
    }


    return <div className="flex items-center space-x-4">
        <div className="w-40 p-1 border rounded shadow p-1 border-gray-500 cursor-pointer hover:text-gray-500 hover:border-gray-500 flex items-center justify-center">
        {isUploading ? (
            <div>
                <Loader variant="dots" size="xl" color="teal" />
            </div>
        ) : (
            <div>
                <input
                    id="upd1"
                    type="file"
                    accept="image/png,image/gif,image/jpeg,image/webp"
                    onChange={(e) => handleUploadFile(e)}
                    onClick={(event) => {
                        event.target.value = null;
                    }}
                />
                <label htmlFor="upd1">
                    <div className="flex items-center justify-center cursor-pointer space-x-4">
                        <Upload className="text-gray-500" size={20}/>
                        <span className="text-sm text-gray-500 text-center font-medium">Attach Files</span>
                    </div>
                </label>
            </div>
        )}
    </div>

    {/*    actual files*/}
        {data && data.length > 0 && <Popover
            opened={opened}
            onClose={() => setOpened(false)}
            target={<Button leftIcon={<Paperclip/>} onClick={() => setOpened((o) => !o)}>{data.length}</Button>}
            width={260}
            position="right"
            placement={"start"}
            withArrow
            radius="xs"
            spacing="xs"
            shadow="xl"
        >

                {data.map((v, _) => <div key={v} className="w-full border-b pb-2 mb-2 flex space-x-2">
                    <img src={v} className="w-32 h-auto rounded-lg" alt=""/>
                    <Button onClick={() => onRemove(v)} leftIcon={<TrashX size={20}/>} variant="subtle" color={"red"} size={"xs"}>Delete</Button>
                </div>)}

        </Popover>}
    </div>
}