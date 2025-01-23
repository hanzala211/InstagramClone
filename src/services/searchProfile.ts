import { sendRequest } from "../utils/sendRequest";

export const getPost = async (data: any) => {
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `post/${data.postID}`,
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

export const follow = async (data: any) => {
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `user/follow/${data.selectedProfile._id}`,
			configs: {
				method: 'POST',
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


export const unfollow = async (data: any) => {
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `user/unfollow/${data.selectedProfile._id}`,
			configs: {
				method: 'POST',
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


export const getDataOnHover = async (data: any) => {
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `user/search/${data.username}`,
			configs: {
				method: 'GET',
				headers: {
					"Authorization": `${data.token}`,
				},
				signal: data.signal
			}
		})
		return res;
	} catch (error) {
		console.error(error)
	}
}


export const getDataOnClick = async (data: any) => {
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `user/search/${data.username}`,
			configs: {
				method: 'GET',
				headers: {
					"Authorization": data.token,
				},
			}
		})
		return res;
	} catch (error) {
		console.error(error)
	}
}