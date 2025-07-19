// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { FirebaseStorage, getStorage } from "firebase/storage";
// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhdJpA6zZergpf-X2lRFWYfVtr5jlwNe4",
  authDomain: "nextfifo.firebaseapp.com",
  projectId: "nextfifo",
  storageBucket: "nextfifo.firebasestorage.app",
  messagingSenderId: "230621740189",
  appId: "1:230621740189:web:83244ec8f636c54cc6e874"
};

// Initialize Firebase
//const app = initializeApp(firebaseConfig);

// Initialize Firebase
const currentApps = getApps();
let auth: Auth;
let storage: FirebaseStorage;

if (!currentApps.length) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  storage = getStorage(app);
} else {
  const app = currentApps[0];
  auth = getAuth(app);
  storage = getStorage(app);
}

export { auth, storage };