import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export async function fetchUser(
	userValue,
	password,
	setLoading,
	setUserData,
	setUserValue,
	setPassword,
	setMainLoading,
	navigate
) {
	const userId = {
		identifier: userValue,
		password: password,
	};
	const raw = JSON.stringify(userId);
	try {
		setLoading(true);
		const response = await fetch(
			'https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/auth/login',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: raw,
				redirect: 'follow',
			}
		);

		const result = await response.json();
		setUserData(result);
		if (result && result.status === 'success' && result.data) {
			setMainLoading(true);
			setUserValue('');
			setPassword('');
			setDoc(doc(db, 'users', `${result.data.user._id}`), {
				userName: `${result.data.user.userName}`,
				id: `${result.data.user._id}`,
			});
			navigate('/home');
			localStorage.setItem('token', JSON.stringify(result.data.token));
		}
	} catch (error) {
		setUserData({
			status: 'fail',
			data: 'Server Is Down.Please try after sometime',
			error: error,
		});
	} finally {
		setMainLoading(false);
		setLoading(false);
	}
}

export async function fetchData(
	fullName,
	userName,
	emailAddress,
	signupPassword,
	setMainLoading,
	setLoading,
	setUserData,
	setSuccessMessage,
	setEmailAddress,
	setSignupPassword,
	setFullName,
	setUserName,
    navigate
) {
	const data = JSON.stringify({
		fullName: fullName,
		userName: userName,
		email: emailAddress,
		password: signupPassword,
	});
	try {
		setMainLoading(true);
		setLoading(true);
		setUserData({});
		setSuccessMessage('');
		const response = await fetch(
			'https://instagram-backend-dkh3c2bghbcqgpd9.canadacentral-01.azurewebsites.net/api/v1/auth/signup',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: data,
				redirect: 'follow',
			}
		);
		const result = await response.json();
		setUserData(result);
		if (result.status === 'success') {
			setEmailAddress('');
			setSignupPassword('');
			setFullName('');
			setUserName('');
			addDoc(collection(db, 'users', `${result.data.user._id}`), {
				userName: `${userName}`,
				id: `${result.data.user._id}`,
			});
			setSuccessMessage(result.status);
			navigate('/home');
			localStorage.setItem('token', JSON.stringify(result.data.token));
		}
	} catch (error) {
		setUserData({
			status: 'fail',
			data: 'Server Is Down.Please try after sometime',
			error: error,
		});
	} finally {
		setLoading(false);
		setMainLoading(false);
	}
}
