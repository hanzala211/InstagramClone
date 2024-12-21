import { doc, setDoc } from 'firebase/firestore';
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
			`${import.meta.env.VITE_APP_URL}api/v1/auth/login`,
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
			`${import.meta.env.VITE_APP_URL}api/v1/auth/signup`,
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
			navigate('/home');
			setDoc(doc(db, 'users', `${result.data.user._id}`), {
				userName: `${result.data.user.userName}`,
				id: `${result.data.user._id}`,
			});
			localStorage.setItem('token', JSON.stringify(result.data.token));
			setSuccessMessage(result.status);
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
export async function fetchMe(
	setMainLoading,
	setUserData,
	token,
	params,
	fetchUserDataOnClick,
	setSelectedProfile
) {
	try {
		setMainLoading(true);
		setUserData([]);
		const response = await fetch(
			`${import.meta.env.VITE_APP_URL}api/v1/auth/me`,
			{
				method: 'GET',
				headers: {
					Authorization: `${token}`,
				},
				redirect: 'follow',
			}
		);
		const result = await response.json();
		setUserData({
			status: result.status,
			data: {
				token: token,
				user: {
					...result.data,
				},
			},
		});
	} catch (error) {
		console.error(error);
	} finally {
		setMainLoading(false);
		if (params) {
			fetchUserDataOnClick(
				params.username,
				null,
				token,
				setSelectedProfile,
				setMainLoading
			);
		}
	}
}
