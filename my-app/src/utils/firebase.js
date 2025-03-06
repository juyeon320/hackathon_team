import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, updateDoc } from "firebase/firestore";

// 🔹 Firebase 설정
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// 🔹 이미 초기화된 앱이 없으면 초기화, 있으면 재사용
let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

// 🔹 Firestore 인스턴스
export const db = getFirestore(app);

/ 이름이 "sep"인 문서 하나를 찾아 xp를 리턴 */
export async function getSepXP() {
    // db가 정의되어 있어야 함!
    const q = query(collection(db, "hallOfFame"), where("name", "==", "sep"));
    const snap = await getDocs(q);
    if (snap.empty) {
        console.warn("No doc with name=sep in hallOfFame");
        return 0;
    }
    return snap.docs[0].data().xp ?? 0;
}

/ 이름이 "sep"인 문서를 찾아 xp를 newXp로 업데이트 */
export async function updateSepXP(newXp) {
    const q = query(collection(db, "hallOfFame"), where("name", "==", "sep"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        console.warn("No doc with name=sep in hallOfFame");
        return;
    }
    const docRef = snapshot.docs[0].ref;
    await updateDoc(docRef, { xp: newXp });
    console.log(`sep XP updated to ${newXp}`);
}