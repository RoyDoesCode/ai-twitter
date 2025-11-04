import admin from "firebase-admin";

const serviceAccount = require("@/service-account-key.json");

const app =
    admin.apps.length === 0
        ? admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
        : admin.apps[0];

const db = admin.firestore(app!).collection("clients");

export default db;
