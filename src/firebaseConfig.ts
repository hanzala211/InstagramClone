import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_REACT_API_KEY,
	authDomain: 'instachat-98ace.firebaseapp.com',
	projectId: 'instachat-98ace',
	storageBucket: 'instachat-98ace.firebasestorage.app',
	messagingSenderId: '772013663673',
	appId: import.meta.env.VITE_APP_ID,
	measurementId: 'G-PK5KEZ71NF',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
const analytics = getAnalytics(app);
