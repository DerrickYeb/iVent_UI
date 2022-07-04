import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {RecoilRoot} from "recoil";
import { SWRConfig  } from 'swr'
ReactDOM.render(
    <React.StrictMode>
        <RecoilRoot>
            <SWRConfig value={{
                onError: (error, key) => {
                    if (error?.response?.status === 401) {
                        window.location.href = "/"
                        // We can send the error to Sentry,
                        // or show a notification UI.
                    }
                }
            }}>
            <App/>
            </SWRConfig>
        </RecoilRoot>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
