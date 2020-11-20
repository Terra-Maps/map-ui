import CryptoJS from "crypto-js";

const JsonFormatter = {
  stringify: function (cipherParams: any) {
    // create json object with ciphertext
    var jsonObj: any = {
      ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64),
    };
    // optionally add iv or salt
    if (cipherParams.iv) {
      jsonObj.iv = cipherParams.iv.toString();
    }
    if (cipherParams.salt) {
      jsonObj.s = cipherParams.salt.toString();
    }
    // stringify json object
    return JSON.stringify(jsonObj);
  },
  parse: function (jsonStr: any) {
    // parse json string
    var jsonObj = JSON.parse(jsonStr);
    // extract ciphertext from json object, and create cipher params object
    var cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(jsonObj.ct),
    });
    // optionally extract iv or salt
    if (jsonObj.iv) {
      cipherParams.iv = CryptoJS.enc.Hex.parse(jsonObj.iv);
    }
    if (jsonObj.s) {
      cipherParams.salt = CryptoJS.enc.Hex.parse(jsonObj.s);
    }
    return cipherParams;
  },
};

export const encryptData = (data: string, key: string) => {
  try {

    const encrypted = CryptoJS.AES.encrypt(data, key, {
      format: JsonFormatter,
    });
    console.log(encrypted);
    return JsonFormatter.stringify(encrypted);
  } catch (err) {
    console.log(err);
    return;
  }
};

export const decryptData = (encrypted: any, key: string) => {
  try {

    const encryptedParse = JsonFormatter.parse(encrypted);
    const decrypted = CryptoJS.AES.decrypt(encryptedParse, key, {
      format: JsonFormatter,
    });
    const decryptedData = decrypted.toString(CryptoJS.enc.Utf8);
    console.log(decryptedData, encryptedParse);
    return decryptedData;
  } catch (err) {
    console.log(err);
    return "";
  }
};
