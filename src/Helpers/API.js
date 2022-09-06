import axios from "axios";
import { GetUsername, SetToken } from "./AuthService";

// const API_URL = "https://myinventappbackend.azurewebsites.net";
const API_URL = "http://localhost/defuagapi";

export async function LoginApi(username, password) {
  let payload = {
    Username : username,
    Password: password
  }
  let result = await axios.post(
    `${API_URL}/auth/login`,
      payload,
  );
  return result.data;
}

export async function getAxios(url) {
  const config = {
    method: "get",
    url: `${API_URL}/${url}`,
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  };
  let { data } = await axios(config);
  return data;
}

export async function postAxios(url, payload) {
  const config = {
    method: "post",
    url: `${API_URL}/${url}`,
    data: payload,
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  };
  let { data } = await axios(config);
  return data;
}
