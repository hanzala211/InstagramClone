import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyBBfS5rezYOuIMYnCPr4kA8BsCfwA4chUg',
	authDomain: 'instachat-98ace.firebaseapp.com',
	projectId: 'instachat-98ace',
	storageBucket: 'instachat-98ace.firebasestorage.app',
	messagingSenderId: '772013663673',
	appId: '1:772013663673:web:c1f100b5b26ca169ef8268',
	measurementId: 'G-PK5KEZ71NF',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
const analytics = getAnalytics(app);
