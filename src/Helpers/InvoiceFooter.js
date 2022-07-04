import moment from "moment";
import {formatDate} from "./Constants";

export default function InvoiceFooter({text}){
    return <div className="p-4 mx-auto w-full flex flex-col items-center justify-center pt-4">
        <span>{text}</span>
        <span className="text-xs text-gray-700 font-medium pt-2">Invoice generated date: {formatDate(moment())}</span>
    </div>
}