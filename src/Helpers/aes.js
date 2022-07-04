import CryptoJS, {AES, enc} from "crypto-js";

//const aes256 = require("aes256");

//let secret_key = process.env.REACT_APP_CHAT_SECRET_KEY;

let secret_key = "3343903903493ideddre90re";

// export const EncryptData = (text) => {
//   return aes256.encrypt(secret_key, text);
// };
// export const DecryptData = (cipher) => {
//   return aes256.decrypt(secret_key, cipher);
// };

export function HashPassword(str){
  let hash  = CryptoJS.SHA512(str);
  return hash.toString().toUpperCase();
}