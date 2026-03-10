import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB3KPhmeF6DNmLHANSy31cLpFDfYM7Jgio",
  authDomain: "order-app-2-fb134.firebaseapp.com",
  projectId: "order-app-2-fb134",
  storageBucket: "order-app-2-fb134.firebasestorage.app",
  messagingSenderId: "1069991280145",
  appId: "1:1069991280145:web:24bbaf51d5c5061563fbb0",
};

// Firebaseを初期化
const app = initializeApp(firebaseConfig);

// Firestoreのインスタンスを取得してエクスポート
// これを MenuPage.jsx などで import して使う
export const db = getFirestore(app);
