import {useHistory} from "react-router-dom";
import {Button} from "@mantine/core";

export default function EmptyDataWidget({title, desc, btnText, btnUrl}) {
    const history = useHistory();
    return <div className="flex flex-col items-center justify-center bg-white rounded-lg p-24 mt-6 w-2/4 h-2/4 mx-auto text-center space-y-6">
        <span className="text-2xl text-gray-700">{title}</span>
        <span className="text-gray-600 text-sm">{desc}</span>
        <div>
            <Button size="lg" uppercase={true} onClick={() => history.push(btnUrl)}>{btnText}</Button>
        </div>
    </div>
}