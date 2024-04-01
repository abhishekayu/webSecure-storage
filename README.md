# webSecure-storage 🔒

**webSecure-storage** is a user-friendly package designed to facilitate secure data storage across multiple mediums including local storage, session storage, cookies, and indexedDB. Leveraging encryption techniques, it ensures data security and mitigates common attacks. Additionally, it offers features for verifying keys and compressing data, thereby enhancing both security and efficiency.

## Features

- **webSecure-storage** provides more secure operations to customize data storage and retrieval by offering passcode, HMAC key, algorithm, compression, and expiry time, and Similar default operations for storage.
- Additionally, this package provides a simple way to get events of local storage, session storage, cookies, and indexedDB to detect changes in storage, handle expired data, and get/set data from storage.
- **Data Compression:** Provide data compression parameters to compress data while storing it; you can manipulate them.
- **Algorithm supported:** **AES**, **DES**, **RC4**, **Rabbit**, **RabbitLegacy**, **TripleDES**, **EvpKDF**, **PBKDF2**, and **RC4Drop**.
- **Expiry for Storage:** You can set an expiration time for data by providing the time in milliseconds. Once expired, the data is removed.
- **Separate Configuration for Each Item:** You can set passcodes and HMAC keys separately for each item. When retrieving an item, you need to provide the passcode and HMAC key.
- **Global Configuration for Storage:** You can set a global passcode and HMAC key for the entire storage system. **Note:** Each storage medium and method (such as localStorage, sessionStorage, etc.) is treated separately.
- **Simple IndexDB Manipulation with Encrypted Data:** Offer a straightforward method to manage IndexedDB similar to localStorage. Allow storing data in IndexedDB as encrypted and compressed data for enhanced security and efficiency.
- **Events for Each Storage and Every Event:** Fire events for every storage type, including IndexedDB and cookies etc. Trigger events based on various data-related actions such as expiration, setting, getting, removal, etc.
- Our default encryption and decryption algorithm is AES.

#### Advanced Encryption Standard (AES)

The Advanced Encryption Standard is a symmetric encryption algorithm that is the most frequently used method of data encryption globally. Often referred to as the gold standard for data encryption, AES is used by many government bodies worldwide, including in the U.S.

## Installation 💻

```bash
npm install webSecure-storage
```

## Usage 🚀

```javascript
Import the package
import { ayu } from "webSecure-storage";

```

# Local Storage 📦

You can set a passcode and HMAC key for local storage, which will apply globally for localStorage. Once you've set these using the `setPasscode` and `setHmacKey` functions, you won't need to provide them again when setting or getting items. The HMAC key is optional; if you don't want to specify it, the-n the passcode will be used as the HMAC key by default.

```javascript
ayu.localStorage.setPasscode("YourPasscode");
ayu.localStorage.setHmacKey("YourHMACKey");
```

**Optional HMAC Key:** If you don't provide an HMAC key, the system will automatically use the passcode as the HMAC key. Alternatively, if you've set the HMAC key using `setHmacKey`, it will use that instead.

**Separate Configuration for Each Item:** You can set passcodes and HMAC keys separately for each item. When retrieving an item, you need to provide the passcode and HMAC key.

**Mandatory Parameters:** The key and data parameters are mandatory for item storage.

**Passcode Requirement:** If you haven't set the passcode using `setPasscode`, you must provide it when storing an item. However, if you've set it using `setPasscode` then you don't need to provide it again. Similarly, if the HMAC key is your passcode by default, you don't need to pass it separately however if you want to set your own HMAC key for each item then you have to pass it.

## More Optional Parameters:

**Algorithm (algo):** You can specify the encryption algorithm. The default is AES, but you can choose others like DES or RC4.

**Compression (compress):** By default, data is compressed (true). If you prefer uncompressed data, pass false.

**Expiry (expireAt):** You can set an expiration time for data by providing the time in milliseconds. Once expired, the data is removed.

### Setting data in localStorage

```javascript
ayu.localStorage.setItem({
  key: "Your Key", //key
  data: "Your Data", // data
  passcode: "Your Passcode", // if you have set passcode using setPasscode then you don't have to pass it here.
  hmacKey: "Your HmacKey", // optional if you have set it using setHmacKey then you don't have to pass it here or if you have set passcode using setPasscode then you don't have to pass it here hamckey will be passcode by default.
  algo: "Your Algo", // optional default is AES.
  compress: true, // optional default is true.
  expireAt: 5000, // optional default is null, null means never expire.
});
```

### Getting data from in localStorage

**Optional Parameters for Retrieval:** When retrieving an item, the algorithm (algo) and HMAC key are optional. By default, the algorithm is AES, and if you've set the HMAC key while storing the item, you need to pass it.

**Passcode Requirement:** Providing the passcode is mandatory for item retrieval. If you haven't set it using setPasscode, you must pass it here. Additionally, ensure consistency between the passcode used for setItem and getItem.

**Mandatory Parameters:** You must provide the key when retrieving an item.

**Full Configuration Matching:** If you've set the passcode, HMAC key, and algorithm while storing the item, you need to pass the same parameters when retrieving the item corresponding to the key.

```javascript
let data = ayu.localStorage.getItem({
  key: "Your Key", //key
  passcode: "Your Passcode", // if you have set passcode using setPasscode then you don't have to pass it here however if you set passcode while setting the item then you have to pass it here.
  algo: "Your Algo", // if you have set different algo while setting the item then you have to pass it here however default is AES.
  hmacKey: "Your Hmackey", // if you have set hmacKey while setting the item then you have to pass it here however if you have set passcode using setPasscode then you don't have to pass it here.
});
console.log(data);
```

### Remove Item from localStorage

For removing the item key is mandatory.
and to be secure we overwrite the data with random string 10 times and then remove the item.

```javascript
ayu.localStorage.removeItem("Your Key");
```

### Clear localStorage

Clearing the whole local storage we overwrite the data with random string 10 times and then clear the local storage.

```javascript
ayu.localStorage.clear();
```

## Events for localStorage

- onLocalStoreSet event will be fired when you set the item in local storage.

```javascript
ayu.on("onLocalStoreSet", (key, data) => {
  console.log("Data set in LocalStore:", key, data);
});
```

- onLocalStoreGet event will be fired when you get the item from local storage.

```javascript
ayu.on("onLocalStoreGet", (key, data) => {
  console.log("Data get from LocalStore:", key, data);
});
```

- onLocalStoreRemoved event will be fired when you remove the item from local storage or clear the local storage.

```javascript
ayu.on("onLocalStoreRemoved", (key) => {
  console.log("Data removed or cleared from LocalStore:", key);
});
```

- onLocalStoreChange event will be fired when you change the item in local storage or occur any change in local storage from webbrowser.

```javascript
ayu.on("onLocalStoreChange", (key, event) => {
  console.log("Local storage change detected:", key, event);
});
```

- onLocalStoreExpired event will be fired when the item in local storage is expired and you try to get that item.

```javascript
ayu.on("onLocalStoreExpired", (key) => {
  console.log(`Data with key ${key} has been expired.`);
});
```

# Session Storage 🗳

Similar to local storage, you can set a passcode and HMAC key for session storage, which will apply globally for sessionStorage. Once you've set these using the setPasscode and setHmacKey functions, you won't need to provide them again when setting or getting items. The HMAC key is optional; if you don't want to specify it, the passcode will be used as the HMAC key by default.

```javascript
ayu.sessionStorage.setPasscode("Your Passcode");
ayu.sessionStorage.setHmacKey("Your HmacKey");
```

### Setting data in sessionStorage

Similar to local storage's approach you can set the item in session storage by using same approach.

```javascript
ayu.sessionStorage.setItem({
  key: "Your Key", //key
  data: "Your Data", // data
  passcode: "Your Passcode", // Info : Read localStorage, Similar to localStorage.
  algo: "Your Algo", // Info : Read localStorage, Similar to localStorage.
  hmacKey: "Your HmacKey", // Info : Read localStorage, Similar to localStorage.
  compress: true, // Info : Read localStorage, Similar to localStorage.
  expireAt: 5000, // Info : Read localStorage, Similar to localStorage.
});
```

### Getting data in sessionStorage

Similar to local storage you can get the item from session storage by using same approach.

```javascript
let dataSession = ayu.sessionStorage.getItem({
  key: "Your Key", //key
  passcode: "Your Passcode", // Read localStorage, Similar to localStorage.
  algo: "Your Algo", // Read localStorage, Similar to localStorage.
  hmacKey: "Your Hmackey", // Read localStorage, Similar to localStorage.
});

console.log(dataSession);
```

### Remove Item from sessionStorage

For removing the item key is mandatory.
and to be secure we overwrite the data with random string 10 times and then remove the item.

```javascript
ayu.sessionStorage.removeItem("Your Key");
```

### Clear sessionStorage

Clearing the whole local storage we overwrite the data with random string 10 times and then clear the Session Storage.

```javascript
ayu.sessionStorage.clear();
```

## Events for sessionStorage

- onSessionStoreSet event will be fired when you set the item in session storage.

```javascript
ayu.on("onSessionStoreSet", (key, data) => {
  console.log(`Data with key ${key} has been added
    to session storage.`);
});
```

- onSessionStoreGet event will be fired when you get the item from session storage.

```javascript
ayu.on("onSessionStoreGet", (key, data) => {
  console.log(`Data with key ${key} has been gett to session storage.`);
});
```

- onSessionStoreRemoved event will be fired when you remove the item from session storage.

```javascript
ayu.on("onSessionStoreRemoved", (key) => {
  console.log(`Data with key ${key} has been removed from session storage.`);
});
```

- onSessionStoreChange event will be fired when you change the item in session storage or occur any change in session storage from webbrowser.

```javascript
ayu.on("onSessionStoreChange", (key, event) => {
  console.log(`Session storage change detected for key ${key}.`);
});
```

- onLocalStoreExpired event will be fired when the item in local storage is expired and you try to get that item.

```javascript
ayu.on("onSessionStoreExpired", (key) => {
  console.log(`Data with key ${key} has been expired.`);
});
```

# Cookies 🍪

Similar to local storage you can set passcode and hmac key for cookies which will apply globally for cookies. Once you've set these using the setPasscode and setHmacKey functions, you won't need to provide them again when setting or getting items. The HMAC key is optional; if you don't want to specify it, the passcode will be used as the HMAC key by default.

```javascript
ayu.cookies.setPasscode("Your Passcode");
ayu.cookies.setHmacKey("Your HmacKey");
```

### Setting items in Cookies

Similar to local storage's approach you can set the item in cookies by using same approach.

```javascript
ayu.cookies.setItem({
  key: "Your Key",
  data: "Your Data",
  expireAt: 9000, // Info : Similar to localStorage,
  passcode: "Your Passcode", // Info : Similar to localStorage,
  algo: "Your Algo", // Info : Similar to localStorage,
  hmacKey: "Your HmacKey", // Info : Similar to localStorage,
  compress: false, // Info : Similar to localStorage,
});
```

### Getting items in Cookies

Similar to local storage's approach you can set the item in cookies by using same approach.

```javascript
let datacookie = ayu.cookies.getItem({
  key: "Your Key",
  passcode: "Your Passcode", // Info : Similar to localStorage,
  algo: "Your Algo", // Info : Similar to localStorage,
  hmacKey: "Your HmacKey", // Info : Similar to localStorage,
});

console.log(datacookie);
```

### Remove Item from cookies

```javascript
ayu.cookies.removeItem("Your Key");
```

### Clear cookies

```javascript
ayu.cookies.clear();
```

## Events for cookies

- onCookieStoreSet event will be fired when you set the item in cookies.

```javascript
ayu.on("onCookieStoreSet", (key, data) => {
  console.log(`Cookie with key ${(key, data)} has been added.`);
});
```

- onCookieStoreGet event will be fired when you get the item from cookies.

```javascript
ayu.on("onCookieStoreGet", (key, data) => {
  console.log(`Cookie with key ${(key, data)} has been gett.`);
});
```

- onCookieStoreRemoved event will be fired when you remove the item from cookies.

```javascript
ayu.on("onCookieStoreRemoved", (key) => {
  console.log(`Cookie with key ${key} has been removed.`);
});
```

# IndexedDB 🧮

Similar to local storage you can set passcode and hmac key for indexedDB which will apply globally for indexedDB. Once you've set these using the setPasscode and setHmacKey functions, you won't need to provide them again when setting or getting items. The HMAC key is optional; if you don't want to specify it, the passcode will be used as the HMAC key by default.

```javascript
ayu.indexedDB.setPasscode("Your Passcode");
ayu.indexedDB.setHmacKey("Your HmacKey");
```

### Setting Single Item in IndexedDB

Setting Single encrypted item in indexedDB including two more parameters rest of the parameters are working same as local storage's approach.

```javascript
ayu.indexedDB
  .setItem({
    dbName: "YourDatabaseName",
    storeName: "YourStoreName",
    key: "uniqueKey",
    data: { Your: data },
    compress: true, // Info : Similar to localStorage,
    expireAt: 5000, // Info : Similar to localStorage,
    passcode: "Your Passcode", // Info : Similar to localStorage,
    algo: "Your Algo", // Info : Similar to localStorage,
    hmacKey: "Your HmacKey", // Info : Similar to localStorage,
  })
  .then(() => {
    console.log("Item set successfully.");
  })
  .catch((error) => {
    console.error("Error occurred while setting item:", error);
  });
```

### Getting Single Item in IndexedDB

Getting Single decrypted item from indexedDB.

```javascript
ayu.indexedDB
  .getItem({
    dbName: "YourDatabaseName",
    storeName: "YourStoreName",
    key: "uniqueKey",
    passcode: "Your Passcode", // Info : Similar to localStorage,
    algo: "Your Algo", // Info : Similar to localStorage,
    hmacKey: "Your Hmackey", // Info : Similar to localStorage,
  })
  .then((decryptedData) => {
    console.log("Decrypted data:", decryptedData);
  })
  .catch((error) => {
    console.error("Error occurred while getting item:", error);
  });
```

### Set Multiple Encrypted Items in IndexedDB.

```javascript
const itemsToSet = [
  { key: "key1", data: { your: "data1" } },
  { key: "key2", data: { your: "data2" } },
  // Add more items as needed
];

const setItemPromises = itemsToSet.map((item) => {
  return ayu.indexedDB.setItem({
    dbName: "YourDatabaseName",
    storeName: "YourStoreName",
    key: item.key,
    data: item.data,
    compress: true, // Info : Similar to localStorage,
    expireAt: 3600 * 1000, // Info : Similar to localStorage,
    passcode: "Your Passcode", // Info : Similar to localStorage,
    algo: "Your Algo", // Info : Similar to localStorage,
    hmacKey: "Your Hmackey", // Info : Similar to localStorage,
  });
});

Promise.all(setItemPromises)
  .then(() => {
    console.log("All items set successfully.");
  })
  .catch((error) => {
    console.error("Error occurred while setting items:", error);
  });
```

### Get Multiple Encrypted Items from IndexedDB.

```javascript
const keysToRetrieve = ["key1","key2"];

const getItemPromises = keysToRetrieve.map((key) => {
    return ayu.indexedDB.getItem({
    dbName: "YourDatabaseName",
    storeName: "YourStoreName",
    key: key,
    passcode: "Your Passcode",     // Info : Similar to localStorage,
    algo: "Your Algo",       // Info : Similar to localStorage,
    hmacKey: "Your Hmackey",     // Info : Similar to localStorage,
    });
});

Promise.all(getItemPromises).then((decryptedDataArray) => {
    console.log("Decrypted data for all keys:"decryptedDataArray);
}).catch((error) => {
    console.error("Error occurred while getting items:", error);
});
```

### Remove Item from IndexedDB by Key

```javascript
ayu.indexedDB
  .removeItem({
    dbName: "YourDatabaseName",
    storeName: "YourStoreName",
    key: "key2",
  })
  .then(() => {
    console.log("Item removed successfully.");
  })
  .catch((error) => {
    console.error("Error occurred while removing item:", error);
  });
```

### Clear Store Of IndexedDB

```javascript
ayu.indexedDB
  .clear({
    dbName: "YourDatabaseName",
    storeName: "YourStoreName",
  })
  .then(() => {
    console.log("Store cleared successfully.");
  })
  .catch((error) => {
    console.error("Error occurred while clearing store:", error);
  });
```

### Delete IndexedDB Database

```javascript
ayu.indexedDB.deleteDB("YourDatabaseName").then(() => {
  console.log("Database deleted successfully.");
});
```

## Events for indexedDB

- onIndexedDBSet event will be fired when you set the item in indexedDB.

```javascript
ayu.on("onIndexedDBSet", (key, data) => {
  console.log(`Data with  ${key} has been added to indexedDB.`);
});
```

- onIndexedDBGet event will be fired when you get the item from indexedDB.

```javascript
ayu.on("onIndexedDBGet", (key, data) => {
  console.log(`${data} with ${key}has been added to indexedDB.`);
});
```

- onIndexedDBRemoved event will be fired when you remove the item from indexedDB.

```javascript
ayu.on("onIndexedDBRemoved", (key, dbName, storeName) => {
  console.log(
    `${(dbName, storeName)} with key ${key} has been removed from indexedDB.`
  );
});
```

- onIndexedDBClear event will be fired when you clear the store from indexedDB.

```javascript
ayu.on("onIndexedDBClear", (dbName, storeName) => {
  console.log(`Store ${storeName} has been cleared from indexedDB.`);
});
```

- onIndexedDBDeleted event will be fired when you delete the database from indexedDB.

```javascript
ayu.on("onIndexedDBDeleted", (dbName, storeName) => {
  console.log(
    `Database ${(dbName, storeName)} has been deleted from indexedDB.`
  );
});
```

## Contributor

Abhishek Verma

📧 imdarkcoder@gmail.com.com

<a href="mailto:imdarkcoder@gmail.com" target="_blank">
  <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="email"/>
</a>
 <a href="https://www.linkedin.com/in/abhishek-ayu/" target="_blank">
  <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="abhishekayu"/>
 </a> 

## Important: For any Queries, Suggestions, or Improvements

If you have any questions, feedback, or ideas for improvement, please don't hesitate to raise an issue or submit a pull request on GitHub. Your input is highly valued and helps to enhance this project for everyone. Thank you for your contribution!

## Contribute

Contributions are always welcome!
Please read the [contribution guidelines](contributing.md) first.

## License

This project is licensed under the MIT License - see the LICENSE file for details. [MIT](https://choosealicense.com/licenses/mit/)
