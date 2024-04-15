const CryptoJS = require("crypto-js");
const pako = require("pako");
const { encryptData, decryptData } = require("./encrypt");
const { openDB } = require("idb");
let GLencryptionKey;
let GLhmacKey;
let GLsessionStorageEncryptionKey;
let GLsessionStorageHmacKey;
let GLcookieEncryptionKey;
let GLcookieHmacKey;
let GLindexedDBEncryptionKey;
let GLindexedDBHmacKey;
function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZab-AYU-cdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}[]|:;<>,.?/`~";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const ayu = {
  localStorage: {
    setPasscode(key) {
      GLencryptionKey = key;
    },
    setHmacKey(key) {
      GLhmacKey = key;
    },
    setItem({
      key,
      data,
      compress = true,
      passcode = GLencryptionKey,
      algo = "AES",
      hmacKey = GLhmacKey ? GLhmacKey : passcode,
      expireAt = null,
    }) {
      try {
        let compressedData = data;
        if (compress) {
          compressedData = pako.deflate(JSON.stringify(data));
        }
        const encryptedData = encryptData(compressedData, passcode, algo);
        const hmac = CryptoJS.HmacSHA256(encryptedData, hmacKey).toString();

        const currentTime = new Date().getTime();
        const expireTime = expireAt ? currentTime + expireAt : null;

        localStorage.setItem(
          key,
          JSON.stringify({
            data: encryptedData,
            hmac,
            compressed: compress,
            expireTime,
          })
        );

        ayu.events.emit("onLocalStoreSet", key, data);
      } catch (error) {
        throw new Error(
          "Error occurred while setting localStorage item:",
          error
        );
      }
    },
    getItem({
      key,
      passcode = GLencryptionKey,
      algo = "AES",
      hmacKey = GLhmacKey ? GLhmacKey : passcode,
    }) {
      try {
        const storedItem = localStorage.getItem(key);
        if (!storedItem) return null;

        const { data, hmac, compressed, expireTime } = JSON.parse(storedItem);

        const currentTime = new Date().getTime();

        if (expireTime !== null && currentTime > expireTime) {
          localStorage.removeItem(key);
          ayu.events.emit("onLocalStoreExpired", key);
          return null;
        }
        const calculatedHmac = CryptoJS.HmacSHA256(data, hmacKey).toString();
        if (calculatedHmac !== hmac) {
          throw new Error(
            "HMAC verification failed of localStorage. Data may have been tampered with."
          );
        }
        const decryptedData = decryptData(data, passcode, algo);
        ayu.events.emit("onLocalStoreGet", key, data);
        if (compressed) {
          return JSON.parse(pako.inflate(decryptedData, { to: "string" }));
        } else {
          return decryptedData;
        }
      } catch (error) {
        throw new Error(
          "Error occurred while getting localStorage item:",
          error
        );
      }
    },
    removeItem(key) {
      try {
        const encryptedData = localStorage.getItem(key);
        if (!encryptedData) return;
        for (let i = 0; i < 10; i++) {
          let randomString = generateRandomString(30);
          localStorage.setItem(key, randomString);
        }
        localStorage.removeItem(key);
        ayu.events.emit("onLocalStoreRemoved", key);
      } catch (error) {
        throw new Error(
          "Error occurred while removing localStorage item:",
          error
        );
      }
    },
    clear() {
      try {
        const keys = Object.keys(localStorage);
        keys.forEach((key) => {
          let randomString = generateRandomString(30);
          localStorage.setItem(key, randomString);
        });
        localStorage.clear();
        keys.forEach((key) => ayu.events.emit("onLocalStoreRemoved", key));
      } catch (error) {
        throw new Error("Error occurred while clearing localStorage:", error);
      }
    },
  },
  sessionStorage: {
    setPasscode(key) {
      GLsessionStorageEncryptionKey = key;
    },
    setHmacKey(key) {
      GLsessionStorageHmacKey = key;
    },
    setItem({
      key,
      data,
      compress = true,
      passcode = GLsessionStorageEncryptionKey,
      algo = "AES",
      hmacKey = GLsessionStorageHmacKey ? GLsessionStorageHmacKey : passcode,
      expireAt = null,
    }) {
      try {
        let compressedData = data;
        if (compress) {
          compressedData = pako.deflate(JSON.stringify(data));
        }
        const encryptedData = encryptData(compressedData, passcode, algo);
        const hmac = CryptoJS.HmacSHA256(encryptedData, hmacKey).toString();

        const currentTime = new Date().getTime();
        const expireTime = expireAt ? currentTime + expireAt : null;

        sessionStorage.setItem(
          key,
          JSON.stringify({
            data: encryptedData,
            hmac,
            compressed: compress,
            expireTime,
          })
        );

        ayu.events.emit("onSessionStoreSet", key, data);
      } catch (error) {
        throw new Error(
          "Error occurred while setting SessionStorage item:",
          error
        );
      }
    },
    getItem({
      key,
      passcode = GLsessionStorageEncryptionKey,
      algo = "AES",
      hmacKey = GLsessionStorageHmacKey ? GLsessionStorageHmacKey : passcode,
    }) {
      try {
        const storedItem = sessionStorage.getItem(key);
        if (!storedItem) return null;

        const { data, hmac, compressed, expireTime } = JSON.parse(storedItem);

        const currentTime = new Date().getTime();

        if (expireTime !== null && currentTime > expireTime) {
          sessionStorage.removeItem(key);
          ayu.events.emit("onSessionStoreExpired", key);
          return null;
        }
        const calculatedHmac = CryptoJS.HmacSHA256(data, hmacKey).toString();
        if (calculatedHmac !== hmac) {
          throw new Error(
            "HMAC verification failed of SessionStorage. Data may have been tampered with."
          );
        }
        const decryptedData = decryptData(data, passcode, algo);
        ayu.events.emit("onSessionStoreGet", key, data);
        if (compressed) {
          return JSON.parse(pako.inflate(decryptedData, { to: "string" }));
        } else {
          return decryptedData;
        }
      } catch (error) {
        throw new Error(
          "Error occurred while getting SessionStorage item:",
          error
        );
      }
    },

    removeItem(key) {
      try {
        const encryptedData = sessionStorage.getItem(key);
        if (!encryptedData) return;
        for (let i = 0; i < 10; i++) {
          let randomString = generateRandomString(30);
          sessionStorage.setItem(key, randomString);
        }
        sessionStorage.removeItem(key);
        ayu.events.emit("onSessionStoreRemoved", key);
      } catch (error) {
        throw new Error(
          "Error occurred while removing SessionStorage item:",
          error
        );
      }
    },
    clear() {
      try {
        const keys = Object.keys(sessionStorage);
        keys.forEach((key) => {
          let randomString = generateRandomString(30);
          sessionStorage.setItem(key, randomString);
        });
        sessionStorage.clear();
        keys.forEach((key) => ayu.events.emit("onSessionStoreRemoved", key));
      } catch (error) {
        throw new Error("Error occurred while clearing SessionStorage:", error);
      }
    },
  },

  cookies: {
    setPasscode(key) {
      GLcookieEncryptionKey = key;
    },
    setHmacKey(key) {
      GLcookieHmacKey = key;
    },
    setItem({
      key,
      data,
      compress = true,
      passcode = GLcookieEncryptionKey,
      algo = "AES",
      hmacKey = GLcookieHmacKey ? GLcookieHmacKey : passcode,
      expireAt = null,
    }) {
      try {
        let compressedData = data;
        if (compress) {
          compressedData = pako.deflate(JSON.stringify(data));
        }
        const encryptedData = encryptData(compressedData, passcode, algo);
        const hmac = CryptoJS.HmacSHA256(encryptedData, hmacKey).toString();

        const currentTime = new Date().getTime();
        const expireTime = expireAt ? currentTime + parseInt(expireAt) : null;
        const expireUTC = expireTime ? new Date(expireTime).toUTCString() : "";

        document.cookie = `${key}=${JSON.stringify({
          data: encryptedData,
          hmac,
          compressed: compress,
          expireTime,
        })}; expires=${expireUTC}; path=/`;

        ayu.events.emit("onCookieStoreSet", key, data);
      } catch (error) {
        throw new Error("Error occurred while setting Cookie item:", error);
      }
    },
    getItem({
      key,
      passcode = GLcookieEncryptionKey,
      algo = "AES",
      hmacKey = GLcookieHmacKey ? GLcookieHmacKey : passcode,
    }) {
      try {
        const cookieString = document.cookie
          .split("; ")
          .find((row) => row.startsWith(`${key}=`));

        if (!cookieString) return null;

        const { data, hmac, compressed, expireTime } = JSON.parse(
          cookieString.split("=")[1]
        );

        const calculatedHmac = CryptoJS.HmacSHA256(data, hmacKey).toString();
        if (calculatedHmac !== hmac) {
          throw new Error(
            "HMAC verification failed of Cookie. Data may have been tampered with."
          );
        }

        const decryptedData = decryptData(data, passcode, algo);
        ayu.events.emit("onCookieStoreGet", key, data);

        if (compressed) {
          return JSON.parse(pako.inflate(decryptedData, { to: "string" }));
        } else {
          return decryptedData;
        }
      } catch (error) {
        throw new Error("Error occurred while getting Cookie item:", error);
      }
    },

    removeItem(key) {
      try {
        document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        ayu.events.emit("onCookieStoreRemoved", key);
      } catch (error) {
        throw new Error("Error occurred while removing Cookie item:", error);
      }
    },
    clear() {
      try {
        const cookies = document.cookie.split("; ");
        cookies.forEach((cookie) => {
          const cookieName = cookie.split("=")[0];
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
          ayu.events.emit("onCookieStoreRemoved", cookieName);
        });
      } catch (error) {
        throw new Error("Error occurred while clearing Cookies:", error);
      }
    },
  },

  indexedDB: {
    setPasscode(key) {
      GLindexedDBEncryptionKey = key;
    },
    setHmacKey(key) {
      GLindexedDBHmacKey = key;
    },
    async setItem({
      dbName,
      storeName,
      key,
      data,
      compress = true,
      passcode = GLindexedDBEncryptionKey,
      algo = "AES",
      hmacKey = GLindexedDBHmacKey ? GLindexedDBHmacKey : passcode,
      expireAt = null,
    }) {
      try {
        const db = await openDB(dbName, 1, {
          upgrade(db) {
            db.createObjectStore(storeName);
          },
        });

        let compressedData = data;
        if (compress) {
          compressedData = pako.deflate(JSON.stringify(data));
        }
        const encryptedData = encryptData(compressedData, passcode, algo);
        const hmac = CryptoJS.HmacSHA256(encryptedData, hmacKey).toString();

        const currentTime = new Date().getTime();
        const expireTime = expireAt ? currentTime + expireAt : null;

        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        store.put(
          {
            data: encryptedData,
            hmac,
            compressed: compress,
            expireTime,
          },
          key
        );

        await tx.done;

        ayu.events.emit(
          "onIndexedDBSet",
          JSON.stringify(key),
          JSON.stringify(data)
        );
      } catch (error) {
        throw new Error("Error occurred while setting IndexedDB item:", error);
      }
    },
    async getItem({
      dbName,
      storeName,
      key,
      passcode = GLindexedDBEncryptionKey,
      algo = "AES",
      hmacKey = GLindexedDBHmacKey ? GLindexedDBHmacKey : passcode,
    }) {
      try {
        const db = await openDB(dbName, 1);

        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);
        const item = await store.get(key);

        if (!item) return null;

        const { data, hmac, compressed, expireTime } = item;

        const currentTime = new Date().getTime();

        if (expireTime !== null && currentTime > expireTime) {
          await store.delete(key);
          ayu.events.emit("onIndexedDBExpired", key);
          return null;
        }

        const calculatedHmac = CryptoJS.HmacSHA256(data, hmacKey).toString();
        if (calculatedHmac !== hmac) {
          throw new Error(
            "HMAC verification failed of IndexedDB data. Data may have been tampered with."
          );
        }

        const decryptedData = decryptData(data, passcode, algo);
        ayu.events.emit("onIndexedDBGet", key, data);

        if (compressed) {
          return JSON.parse(pako.inflate(decryptedData, { to: "string" }));
        } else {
          return decryptedData;
        }
      } catch (error) {
        throw new Error("Error occurred while getting IndexedDB item:", error);
      }
    },

    async removeItem({ dbName, storeName, key }) {
      try {
        const db = await openDB(dbName, 1);
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        await store.delete(key);
        await tx.done;
        ayu.events.emit("onIndexedDBRemove", key, dbName, storeName);
      } catch (error) {
        throw new Error("Error occurred while removing item:", error);
      }
    },

    async clear({ dbName, storeName }) {
      try {
        const db = await openDB(dbName, 1);
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        await store.clear();
        await tx.done;
        ayu.events.emit("onIndexedDBClear", dbName, storeName);
      } catch (error) {
        throw new Error("Error occurred while clearing IndexedDB:", error);
      }
    },

    async deleteDB(dbName) {
      try {
        await indexedDB.deleteDatabase(dbName);
        ayu.events.emit("onIndexedDBDelete", dbName, storeName);
      } catch (error) {
        throw new Error("Error occurred while deleting database:", error);
      }
    },
  },
  events: new (require("events").EventEmitter)(),
  on(event, listener) {
    this.events.on(event, listener);
  },
};

function handleStorageChange(event) {
  try {
    const key = event.key;
    const storageArea =
      event.storageArea === localStorage ? "LocalStore" : "SessionStore";
    if (key !== null) {
      ayu.events.emit("on" + storageArea + "Change", key, event);
      if (storageArea === "LocalStore") {
        localStorage.removeItem(key);
      } else {
        sessionStorage.removeItem(key);
      }
    } else {
      ayu.events.emit("on" + storageArea + "Change", "", event);
    }
  } catch (error) {
    throw new Error("Error occurred while handling storage change:", error);
  }
}

window.addEventListener("storage", handleStorageChange);

module.exports = { ayu };
