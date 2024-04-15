const CryptoJS = require("crypto-js");

function encryptData(data, key, algorithm) {
  algorithm = algorithm ? algorithm.toUpperCase() : "AES";
  let encryptedData;
  switch (algorithm) {
    case "AES":
      encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(data),
        key
      ).toString();
      break;
    case "DES":
      encryptedData = CryptoJS.DES.encrypt(
        JSON.stringify(data),
        key
      ).toString();
      break;
    case "TripleDES":
      encryptedData = CryptoJS.TripleDES.encrypt(
        JSON.stringify(data),
        key
      ).toString();
      break;
    case "RC4":
      encryptedData = CryptoJS.RC4.encrypt(
        JSON.stringify(data),
        key
      ).toString();
      break;
    case "Rabbit":
      encryptedData = CryptoJS.Rabbit.encrypt(
        JSON.stringify(data),
        key
      ).toString();
      break;
    case "RC4Drop":
      encryptedData = CryptoJS.RC4Drop.encrypt(
        JSON.stringify(data),
        key
      ).toString();
      break;
    case "RabbitLegacy":
      encryptedData = CryptoJS.RabbitLegacy.encrypt(
        JSON.stringify(data),
        key
      ).toString();
      break;
    case "EvpKDF":
      encryptedData = CryptoJS.EvpKDF.encrypt(
        JSON.stringify(data),
        key
      ).toString();
      break;
    case "PBKDF2":
      encryptedData = CryptoJS.PBKDF2.encrypt(
        JSON.stringify(data),
        key
      ).toString();
      break;
    default:
      throw new Error("Unsupported encryption algorithm");
  }
  return encryptedData;
}

function decryptData(encryptedData, key, algorithm) {
  algorithm = algorithm ? algorithm.toUpperCase() : "AES";
  let decryptedData;
  switch (algorithm) {
    case "AES":
      const bytesAES = CryptoJS.AES.decrypt(encryptedData, key);
      decryptedData = JSON.parse(bytesAES.toString(CryptoJS.enc.Utf8));
      break;
    case "DES":
      const bytesDES = CryptoJS.DES.decrypt(encryptedData, key);
      decryptedData = JSON.parse(bytesDES.toString(CryptoJS.enc.Utf8));
      break;
    case "TripleDES":
      const bytesTripleDES = CryptoJS.TripleDES.decrypt(encryptedData, key);
      decryptedData = JSON.parse(bytesTripleDES.toString(CryptoJS.enc.Utf8));
      break;
    case "RC4":
      const bytesRC4 = CryptoJS.RC4.decrypt(encryptedData, key);
      decryptedData = JSON.parse(bytesRC4.toString(CryptoJS.enc.Utf8));
      break;
    case "Rabbit":
      const bytesRabbit = CryptoJS.Rabbit.decrypt(encryptedData, key);
      decryptedData = JSON.parse(bytesRabbit.toString(CryptoJS.enc.Utf8));
      break;
    case "RC4Drop":
      const bytesRC4Drop = CryptoJS.RC4Drop.decrypt(encryptedData, key);
      decryptedData = JSON.parse(bytesRC4Drop.toString(CryptoJS.enc.Utf8));
      break;
    case "RabbitLegacy":
      const bytesRabbitLegacy = CryptoJS.RabbitLegacy.decrypt(
        encryptedData,
        key
      );
      decryptedData = JSON.parse(bytesRabbitLegacy.toString(CryptoJS.enc.Utf8));
      break;
    case "EvpKDF":
      const bytesEvpKDF = CryptoJS.EvpKDF.decrypt(encryptedData, key);
      decryptedData = JSON.parse(bytesEvpKDF.toString(CryptoJS.enc.Utf8));
      break;
    case "PBKDF2":
      const bytesPBKDF2 = CryptoJS.PBKDF2.decrypt(encryptedData, key);
      decryptedData = JSON.parse(bytesPBKDF2.toString(CryptoJS.enc.Utf8));
      break;
    default:
      throw new Error("Unsupported encryption algorithm");
  }
  return decryptedData;
}

module.exports = { encryptData, decryptData };
