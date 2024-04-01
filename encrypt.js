const CryptoJS = require("crypto-js");
function encryptData(t, r, e) {
  let p;
  switch ((e = e ? e.toUpperCase() : "AES")) {
    case "AES":
      p = CryptoJS.AES.encrypt(JSON.stringify(t), r).toString();
      break;
    case "DES":
      p = CryptoJS.DES.encrypt(JSON.stringify(t), r).toString();
      break;
    case "TripleDES":
      p = CryptoJS.TripleDES.encrypt(JSON.stringify(t), r).toString();
      break;
    case "RC4":
      p = CryptoJS.RC4.encrypt(JSON.stringify(t), r).toString();
      break;
    case "Rabbit":
      p = CryptoJS.Rabbit.encrypt(JSON.stringify(t), r).toString();
      break;
    case "RC4Drop":
      p = CryptoJS.RC4Drop.encrypt(JSON.stringify(t), r).toString();
      break;
    case "RabbitLegacy":
      p = CryptoJS.RabbitLegacy.encrypt(JSON.stringify(t), r).toString();
      break;
    case "EvpKDF":
      p = CryptoJS.EvpKDF.encrypt(JSON.stringify(t), r).toString();
      break;
    case "PBKDF2":
      p = CryptoJS.PBKDF2.encrypt(JSON.stringify(t), r).toString();
      break;
    default:
      throw new Error("Unsupported encryption algorithm");
  }
  return p;
}
function decryptData(t, r, e) {
  let p;
  switch ((e = e ? e.toUpperCase() : "AES")) {
    case "AES":
      var S = CryptoJS.AES.decrypt(t, r);
      p = JSON.parse(S.toString(CryptoJS.enc.Utf8));
      break;
    case "DES":
      S = CryptoJS.DES.decrypt(t, r);
      p = JSON.parse(S.toString(CryptoJS.enc.Utf8));
      break;
    case "TripleDES":
      S = CryptoJS.TripleDES.decrypt(t, r);
      p = JSON.parse(S.toString(CryptoJS.enc.Utf8));
      break;
    case "RC4":
      S = CryptoJS.RC4.decrypt(t, r);
      p = JSON.parse(S.toString(CryptoJS.enc.Utf8));
      break;
    case "Rabbit":
      S = CryptoJS.Rabbit.decrypt(t, r);
      p = JSON.parse(S.toString(CryptoJS.enc.Utf8));
      break;
    case "RC4Drop":
      S = CryptoJS.RC4Drop.decrypt(t, r);
      p = JSON.parse(S.toString(CryptoJS.enc.Utf8));
      break;
    case "RabbitLegacy":
      S = CryptoJS.RabbitLegacy.decrypt(t, r);
      p = JSON.parse(S.toString(CryptoJS.enc.Utf8));
      break;
    case "EvpKDF":
      S = CryptoJS.EvpKDF.decrypt(t, r);
      p = JSON.parse(S.toString(CryptoJS.enc.Utf8));
      break;
    case "PBKDF2":
      S = CryptoJS.PBKDF2.decrypt(t, r);
      p = JSON.parse(S.toString(CryptoJS.enc.Utf8));
      break;
    default:
      throw new Error("Unsupported encryption algorithm");
  }
  return p;
}
module.exports = { encryptData: encryptData, decryptData: decryptData };
