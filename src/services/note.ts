import { sendRequest } from "../utils/sendRequest";


export const noteCreate = async (data: any) => {
	const raw = JSON.stringify(data.raw)
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `note`,
			configs: {
				method: "POST",
				headers: {
					"Authorization": `${data.token}`,
					'Content-Type': 'application/json',
				},
				body: raw
			}
		})
		return res;
	} catch (error) {
		console.error(error)
	}
}

export const noteUpdate = async (data: any) => {
	const raw = JSON.stringify(data.raw)
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `note`,
			configs: {
				method: "PUT",
				headers: {
					"Authorization": `${data.token}`,
					'Content-Type': 'application/json',
				},
				body: raw
			}
		})
		return res;
	} catch (error) {
		console.error(error)
	}
}

export const noteDelete = async (data: any) => {
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `note`,
			configs: {
				method: "DELETE",
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

export const getNote = async (data: any) => {
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `note`,
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
