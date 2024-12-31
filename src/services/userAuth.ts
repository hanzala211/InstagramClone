import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { User, UserInfo } from '../types/user';
import { NavigateFunction } from 'react-router-dom';

export async function fetchUser(
	userValue: string,
	password: string,
	setLoading: (value: boolean) => void,
	setUserData: (value: User | null) => void,
	setUserValue: (value: string) => void,
	setPassword: (value: string) => void,
	setMainLoading: (value: boolean) => void,
	navigate: NavigateFunction
): Promise<void> {
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
	fullName: string,
	userName: string,
	emailAddress: string,
	signupPassword: string,
	setMainLoading: (value: boolean) => void,
	setLoading: (value: boolean) => void,
	setUserData: (value: User |null) => void,
	setSuccessMessage: (value: string) => void,
	setEmailAddress: (value: string) => void,
	setSignupPassword: (value: string) => void,
	setFullName: (value: string) => void,
	setUserName: (value: string) => void,
	navigate: NavigateFunction
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
	setMainLoading: (value: boolean) => void,
	setUserData: (value: User | null) => void,
	token: any,
	params: any,
	fetchUserDataOnClick: (value: any) => void,
	setSelectedProfile: (value: UserInfo) => void
) {
	try {
		setMainLoading(true);
		setUserData(null);
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

export async function forgotPassword(emailValue: string, setLoading: (value: boolean) => void, setForgotResult: (value: any) => void) {
	try {
		setLoading(true);
		const response = await fetch(
			`${import.meta.env.VITE_APP_URL}api/v1/auth/forgot-password`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: emailValue,
				}),
				redirect: 'follow',
			}
		);
		const result = await response.json();
		setForgotResult(result);
	} catch (error) {
		console.error(error);
	} finally {
		setLoading(false);
	}
}

export async function resetPassword(
	emailValue: string,
	codeValue: string,
	newPassword: string,
	setLoading: (value: boolean) => void,
	navigate: NavigateFunction
) {
	try {
		setLoading(true);
		const response = await fetch(
			`${import.meta.env.VITE_APP_URL}api/v1/auth/reset-password`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: emailValue,
					forgotPasswordCode: codeValue,
					newPassword: newPassword,
				}),
				redirect: 'follow',
			}
		);
		const result = await response.json();
		if (result.status === 'success') {
			navigate('/login');
		}
	} catch (error) {
		console.error(error);
	} finally {
		setLoading(false);
	}
}
