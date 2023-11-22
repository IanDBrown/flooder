import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAV3SmQ6QOpalQXhKaiS_Ls8ZWrhXz9P2g",
  authDomain: "flooder-23db9.firebaseapp.com",
  databaseURL: "https://flooder-23db9-default-rtdb.firebaseio.com",
  projectId: "flooder-23db9",
  storageBucket: "flooder-23db9.appspot.com",
  messagingSenderId: "55913248266",
  appId: "1:55913248266:web:4caf2d50599934435851f3",
  measurementId: "G-8PGCN9ZK4G"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

