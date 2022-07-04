import {
    fileValidator,
} from "../Helpers/FileValidator";
import {useState} from "react";
import useToasts from "../Helpers/MyToasts";
import useAjaxError from "../Helpers/useAjaxError";
import {postAxios} from "../Helpers/API";
import {Plus} from "react-feather";
import {Loader} from '@mantine/core';

export default function AddStockUploadImageWidget({onDone}) {
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


    return <div className="h-32 w-32 border-2 rounded shadow p-1 border-4 border-dashed border-green-400 cursor-pointer hover:text-green-500 hover:border-green-500 flex items-center justify-center">
        {isUploading ? (
            <div>
                <Loader variant="dots" size="lg" color="teal" />
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
                    <div className="w-full h-28 flex items-center justify-center flex-col cursor-pointer space-y-6">
                        <Plus className="text-green-500" size={50}/>
                        <span className="text-sm text-green-500 text-center font-medium">Upload Images</span>
                    </div>
                </label>
            </div>
        )}
    </div>
}