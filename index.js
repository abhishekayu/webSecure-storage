const CryptoJS = require("crypto-js"),
  pako = require("pako"),
  { encryptData, decryptData } = require("./encrypt"),
  openDB = require("idb")["openDB"];
let GLencryptionKey,
  GLhmacKey,
  GLsessionStorageEncryptionKey,
  GLsessionStorageHmacKey,
  GLcookieEncryptionKey,
  GLcookieHmacKey,
  GLindexedDBEncryptionKey,
  GLindexedDBHmacKey;
function generateRandomString(t) {
  var r =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZab-AYU-cdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}[]|:;<>,.?/`~";
  let o = "";
  for (let e = 0; e < t; e++)
    o += r.charAt(Math.floor(Math.random() * r.length));
  return o;
}
const ayu = {
  localStorage: {
    setPasscode(e) {
      GLencryptionKey = e;
    },
    setHmacKey(e) {
      GLhmacKey = e;
    },
    setItem({
      key: t,
      data: r,
      compress: o = !0,
      passcode: a = GLencryptionKey,
      algo: n = "AES",
      hmacKey: i = GLhmacKey || a,
      expireAt: c = null,
    }) {
      try {
        let e = r;
        o && (e = pako.deflate(JSON.stringify(r)));
        var s = encryptData(e, a, n);
        (m = CryptoJS.HmacSHA256(s, i).toString()),
          (d = new Date().getTime()),
          (l = c ? d + c : null);
        localStorage.setItem(
          t,
          JSON.stringify({ data: s, hmac: m, compressed: o, expireTime: l })
        ),
          ayu.events.emit("onLocalStoreSet", t, r);
      } catch (e) {
        throw new Error("Error occurred while setting localStorage item:", e);
      }
    },
    getItem({
      key: e,
      passcode: t = GLencryptionKey,
      algo: r = "AES",
      hmacKey: o = GLhmacKey || t,
    }) {
      try {
        var a = localStorage.getItem(e);
        if (!a) return null;
        var { data: n, hmac: i, compressed: c, expireTime: s } = JSON.parse(a),
          m = new Date().getTime();
        if (null !== s && s < m)
          return (
            localStorage.removeItem(e),
            ayu.events.emit("onLocalStoreExpired", e),
            null
          );
        if (CryptoJS.HmacSHA256(n, o).toString() !== i)
          throw new Error(
            "HMAC verification failed of localStorage. Data may have been tampered with."
          );
        var d = decryptData(n, t, r);
        return (
          ayu.events.emit("onLocalStoreGet", e, n),
          c ? JSON.parse(pako.inflate(d, { to: "string" })) : d
        );
      } catch (e) {
        throw new Error("Error occurred while getting localStorage item:", e);
      }
    },
    removeItem(t) {
      try {
        if (localStorage.getItem(t)) {
          for (let e = 0; e < 10; e++) {
            var r = generateRandomString(30);
            localStorage.setItem(t, r);
          }
          localStorage.removeItem(t), ayu.events.emit("onLocalStoreRemoved", t);
        }
      } catch (e) {
        throw new Error("Error occurred while removing localStorage item:", e);
      }
    },
    clear() {
      try {
        var e = Object.keys(localStorage);
        e.forEach((e) => {
          var t = generateRandomString(30);
          localStorage.setItem(e, t);
        }),
          localStorage.clear(),
          e.forEach((e) => ayu.events.emit("onLocalStoreRemoved", e));
      } catch (e) {
        throw new Error("Error occurred while clearing localStorage:", e);
      }
    },
  },
  sessionStorage: {
    setPasscode(e) {
      GLsessionStorageEncryptionKey = e;
    },
    setHmacKey(e) {
      GLsessionStorageHmacKey = e;
    },
    setItem({
      key: t,
      data: r,
      compress: o = !0,
      passcode: a = GLsessionStorageEncryptionKey,
      algo: n = "AES",
      hmacKey: i = GLsessionStorageHmacKey || a,
      expireAt: c = null,
    }) {
      try {
        let e = r;
        o && (e = pako.deflate(JSON.stringify(r)));
        var s = encryptData(e, a, n),
          m = CryptoJS.HmacSHA256(s, i).toString(),
          d = new Date().getTime(),
          l = c ? d + c : null;
        sessionStorage.setItem(
          t,
          JSON.stringify({ data: s, hmac: m, compressed: o, expireTime: l })
        ),
          ayu.events.emit("onSessionStoreSet", t, r);
      } catch (e) {
        throw new Error("Error occurred while setting SessionStorage item:", e);
      }
    },
    getItem({
      key: e,
      passcode: t = GLsessionStorageEncryptionKey,
      algo: r = "AES",
      hmacKey: o = GLsessionStorageHmacKey || t,
    }) {
      try {
        var a = sessionStorage.getItem(e);
        if (!a) return null;
        var { data: n, hmac: i, compressed: c, expireTime: s } = JSON.parse(a),
          m = new Date().getTime();
        if (null !== s && s < m)
          return (
            sessionStorage.removeItem(e),
            ayu.events.emit("onSessionStoreExpired", e),
            null
          );
        if (CryptoJS.HmacSHA256(n, o).toString() !== i)
          throw new Error(
            "HMAC verification failed of SessionStorage. Data may have been tampered with."
          );
        var d = decryptData(n, t, r);
        return (
          ayu.events.emit("onSessionStoreGet", e, n),
          c ? JSON.parse(pako.inflate(d, { to: "string" })) : d
        );
      } catch (e) {
        throw new Error("Error occurred while getting SessionStorage item:", e);
      }
    },
    removeItem(t) {
      try {
        if (sessionStorage.getItem(t)) {
          for (let e = 0; e < 10; e++) {
            var r = generateRandomString(30);
            sessionStorage.setItem(t, r);
          }
          sessionStorage.removeItem(t),
            ayu.events.emit("onSessionStoreRemoved", t);
        }
      } catch (e) {
        throw new Error(
          "Error occurred while removing SessionStorage item:",
          e
        );
      }
    },
    clear() {
      try {
        var e = Object.keys(sessionStorage);
        e.forEach((e) => {
          var t = generateRandomString(30);
          sessionStorage.setItem(e, t);
        }),
          sessionStorage.clear(),
          e.forEach((e) => ayu.events.emit("onSessionStoreRemoved", e));
      } catch (e) {
        throw new Error("Error occurred while clearing SessionStorage:", e);
      }
    },
  },
  cookies: {
    setPasscode(e) {
      GLcookieEncryptionKey = e;
    },
    setHmacKey(e) {
      GLcookieHmacKey = e;
    },
    setItem({
      key: t,
      data: r,
      compress: o = !0,
      passcode: a = GLcookieEncryptionKey,
      algo: n = "AES",
      hmacKey: i = GLcookieHmacKey || a,
      expireAt: c = null,
    }) {
      try {
        let e = r;
        o && (e = pako.deflate(JSON.stringify(r)));
        var s = encryptData(e, a, n),
          m = CryptoJS.HmacSHA256(s, i).toString(),
          d = new Date().getTime(),
          l = c ? d + parseInt(c) : null,
          y = l ? new Date(l).toUTCString() : "";
        (document.cookie = `${t}=${JSON.stringify({
          data: s,
          hmac: m,
          compressed: o,
          expireTime: l,
        })}; expires=${y}; path=/`),
          ayu.events.emit("onCookieStoreSet", t, r);
      } catch (e) {
        throw new Error("Error occurred while setting Cookie item:", e);
      }
    },
    getItem({
      key: t,
      passcode: e = GLcookieEncryptionKey,
      algo: r = "AES",
      hmacKey: o = GLcookieHmacKey || e,
    }) {
      try {
        var a = document.cookie.split("; ").find((e) => e.startsWith(t + "="));
        if (!a) return null;
        var { data: n, hmac: i, compressed: c } = JSON.parse(a.split("=")[1]);
        if (CryptoJS.HmacSHA256(n, o).toString() !== i)
          throw new Error(
            "HMAC verification failed of Cookie. Data may have been tampered with."
          );
        var s = decryptData(n, e, r);
        return (
          ayu.events.emit("onCookieStoreGet", t, n),
          c ? JSON.parse(pako.inflate(s, { to: "string" })) : s
        );
      } catch (e) {
        throw new Error("Error occurred while getting Cookie item:", e);
      }
    },
    removeItem(e) {
      try {
        (document.cookie =
          e + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/"),
          ayu.events.emit("onCookieStoreRemoved", e);
      } catch (e) {
        throw new Error("Error occurred while removing Cookie item:", e);
      }
    },
    clear() {
      try {
        document.cookie.split("; ").forEach((e) => {
          e = e.split("=")[0];
          (document.cookie =
            e + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/"),
            ayu.events.emit("onCookieStoreRemoved", e);
        });
      } catch (e) {
        throw new Error("Error occurred while clearing Cookies:", e);
      }
    },
  },
  indexedDB: {
    setPasscode(e) {
      GLindexedDBEncryptionKey = e;
    },
    setHmacKey(e) {
      GLindexedDBHmacKey = e;
    },
    async setItem({
      dbName: t,
      storeName: r,
      key: o,
      data: a,
      compress: n = !0,
      passcode: i = GLindexedDBEncryptionKey,
      algo: c = "AES",
      hmacKey: s = GLindexedDBHmacKey || i,
      expireAt: m = null,
    }) {
      try {
        var d = await openDB(t, 1, {
          upgrade(e) {
            e.createObjectStore(r);
          },
        });
        let e = a;
        n && (e = pako.deflate(JSON.stringify(a)));
        var l = encryptData(e, i, c),
          y = CryptoJS.HmacSHA256(l, s).toString(),
          S = new Date().getTime(),
          g = m ? S + m : null,
          p = d.transaction(r, "readwrite");
        p
          .objectStore(r)
          .put({ data: l, hmac: y, compressed: n, expireTime: g }, o),
          await p.done,
          ayu.events.emit(
            "onIndexedDBSet",
            JSON.stringify(o),
            JSON.stringify(a)
          );
      } catch (e) {
        throw new Error("Error occurred while setting IndexedDB item:", e);
      }
    },
    async getItem({
      dbName: e,
      storeName: t,
      key: r,
      passcode: o = GLindexedDBEncryptionKey,
      algo: a = "AES",
      hmacKey: n = GLindexedDBHmacKey || o,
    }) {
      try {
        var i = (await openDB(e, 1)).transaction(t, "readonly").objectStore(t),
          c = await i.get(r);
        if (!c) return null;
        var { data: s, hmac: m, compressed: d, expireTime: l } = c,
          y = new Date().getTime();
        if (null !== l && l < y)
          return (
            await i.delete(r), ayu.events.emit("onIndexedDBExpired", r), null
          );
        if (CryptoJS.HmacSHA256(s, n).toString() !== m)
          throw new Error(
            "HMAC verification failed of IndexedDB data. Data may have been tampered with."
          );
        var S = decryptData(s, o, a);
        return (
          ayu.events.emit("onIndexedDBGet", r, s),
          d ? JSON.parse(pako.inflate(S, { to: "string" })) : S
        );
      } catch (e) {
        throw new Error("Error occurred while getting IndexedDB item:", e);
      }
    },
    async removeItem({ dbName: e, storeName: t, key: r }) {
      try {
        var o = (await openDB(e, 1)).transaction(t, "readwrite");
        await o.objectStore(t).delete(r),
          await o.done,
          ayu.events.emit("onIndexedDBRemove", r, e, t);
      } catch (e) {
        throw new Error("Error occurred while removing item:", e);
      }
    },
    async clear({ dbName: e, storeName: t }) {
      try {
        var r = (await openDB(e, 1)).transaction(t, "readwrite");
        await r.objectStore(t).clear(),
          await r.done,
          ayu.events.emit("onIndexedDBClear", e, t);
      } catch (e) {
        throw new Error("Error occurred while clearing IndexedDB:", e);
      }
    },
    async deleteDB(e) {
      try {
        await indexedDB.deleteDatabase(e),
          ayu.events.emit("onIndexedDBDelete", e, storeName);
      } catch (e) {
        throw new Error("Error occurred while deleting database:", e);
      }
    },
  },
  events: new (require("events").EventEmitter)(),
  on(e, t) {
    this.events.on(e, t);
  },
};
function handleStorageChange(e) {
  try {
    var t = e.key,
      r = e.storageArea === localStorage ? "LocalStore" : "SessionStore";
    null !== t
      ? (ayu.events.emit("on" + r + "Change", t, e),
        ("LocalStore" == r ? localStorage : sessionStorage).removeItem(t))
      : ayu.events.emit("on" + r + "Change", "", e);
  } catch (e) {
    throw new Error("Error occurred while handling storage change:", e);
  }
}
window.addEventListener("storage", handleStorageChange),
  (module.exports = { ayu: ayu });
