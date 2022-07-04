import {useHistory, useLocation} from "react-router-dom";

export const CheckAuth = () => {
    var getUserToken = GetToken();
    if (getUserToken !== null) {
        return true;
    }
    return false;
};

function GetToken() {
    return localStorage.getItem("token");
}

export function SetToken(val) {
    let history = useHistory();
    let location = useLocation();
    let {from} = location.state || {from: {pathname: "/dashboard"}};
    localStorage.setItem("token", val);
    return history.replace(from);
}

export function GetUsername() {
    return localStorage.getItem("user");
}

export function GetTokenG() {
    return localStorage.getItem("token");
}

export function clearCredentialsLocalStorage() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
}