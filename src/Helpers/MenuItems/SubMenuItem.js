import {Timeline} from "@mantine/core";
import React from "react";
import {useHistory} from "react-router-dom";

export default function SubMenuItem({text, loc, ...props}) {
    const history = useHistory();
    return <div
        {...props}
        className="flex items-center space-x-2 text-white pl-4 text-xs p-0.5 rounded-lg cursor-pointer hover:bg-gray-700"
        onClick={() => history.push(loc)}
    >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 stroke-current text-white" fill="none" viewBox="0 0 24 24"
             stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <div className="text-white">
            {text}
        </div>
    </div>

}