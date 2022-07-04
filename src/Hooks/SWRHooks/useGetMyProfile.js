import {GetUsername} from "../../Helpers/AuthService";
import useSWR from "swr";
import {getAxios} from "../../Helpers/API";

export default function useGetMyProfile(){
    const getUsername = GetUsername();
    return useSWR("auth/profile", getAxios)
}