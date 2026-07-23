import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBTQ6XuRlcP-FUTCqBJJMZX9Rzx3D4yOCc",
  authDomain: "triple-crown-store.firebaseapp.com",
  databaseURL: "https://triple-crown-store-default-rtdb.firebaseio.com",
  projectId: "triple-crown-store",
  storageBucket: "triple-crown-store.firebasestorage.app",
  messagingSenderId: "434214818097",
  appId: "1:434214818097:web:5db6fffc41dd8d6626e010"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);