import { sendRequest } from '../utils/sendRequest';

export const login = async (data: any) => {
	const raw = JSON.stringify(data);
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: "auth/login",
			configs: {
				method: "POST",
				headers: {
					'Content-Type': 'application/json',
				},
				body: raw,
			}
		})

		return res;
	} catch (error) {
		console.error(error)
	}
}

export const signup = async (data: any) => {
	const raw = JSON.stringify(data);
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: "auth/signup",
			configs: {
				method: "POST",
				headers: {
					'Content-Type': 'application/json',
				},
				body: raw,
			}
		})

		return res;
	} catch (error) {
		console.error(error)
	}
}


export const me = async (data: any) => {
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: "auth/me",
			configs: {
				method: "GET",
				headers: {
					"Authorization": `${data.token}`,
				},
			}
		})
		return res;
	} catch (error) {
		console.error(error)
	}
}

export const forgot = async (data: any) => {
	const raw = JSON.stringify(data)
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: "auth/forgot-password",
			configs: {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: raw
			},
		})
		return res;
	} catch (error) {
		console.error(error)
	}
}

export const reset = async (data: any) => {
	const raw = JSON.stringify(data)
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: "auth/reset-password",
			configs: {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: raw
			},
		})
		return res;
	} catch (error) {
		console.error(error)
	}
}