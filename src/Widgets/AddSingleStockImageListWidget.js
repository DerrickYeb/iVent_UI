import {ActionIcon, Tooltip} from "@mantine/core";
import {XCircle} from "react-feather";

export default function ({images = [], onRemove}) {
    return images ? images.map((v, i) => <div
        className="relative rounded-lg bg-gray-50 border border-gray-200 p-1 w-32 h-32 cursor-pointer group hover:opacity-75 transition-all duration-500 ease-in-out" key={v?.ImageUrl}>
        <img src={v?.ImageUrl} className="h-full w-full object-cover"/>
        <div className="absolute inset-1/3 opacity-0 group-hover:opacity-100">
            <Tooltip withArrow={true} color="red" label="Click to remove">
                <ActionIcon color="red" onClick={()=> onRemove(i)}>
                <XCircle/>
            </ActionIcon></Tooltip>
        </div>
    </div>) : null;
}