import {useHistory} from "react-router-dom";
import useToast from "../Helpers/MyToasts";
import {useSnackbar} from "notistack";
import {clearCredentialsLocalStorage} from "./AuthService";

function useAjaxError() {
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const history = useHistory();
    const [showToast] = useToast();

    function invokeFunction(err) {
        if (err?.response?.status === 401) {
            clearCredentialsLocalStorage();
            history.push("/");
        } else {
            showToast(err?.response?.data?.Message, "error");
            //showToast("Error... Please try again or check your internet connection", "error");
        }
    }

    return [invokeFunction];
}

export default useAjaxError;
