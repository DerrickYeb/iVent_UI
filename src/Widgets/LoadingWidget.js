import {Loader} from "@mantine/core";

export default function LoadingWidget() {
    return <div className="flex flex-col items-center justify-center bg-white rounded-lg p-24 mt-6 w-2/4 h-2/4 mx-auto text-center space-y-6">
        <Loader/>
        <span>Loading data... Please wait</span>
    </div>
}