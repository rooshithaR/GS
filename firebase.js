// firebase.js
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDHmxd3JuEVyXpHpoD152thiBycPsQ1zEY",
  authDomain: "garden-management-63926.firebaseapp.com",
  projectId: "garden-management-63926",
  storageBucket: "garden-management-63926.appspot.com",
  messagingSenderId: "1013581813309",
  appId: "1:1013581813309:web:224eb8e14cfceeac087c54"
}

// ✅ Only initialize Firestore (no analytics)
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db }
