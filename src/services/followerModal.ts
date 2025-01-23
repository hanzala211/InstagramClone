import { sendRequest } from "../utils/sendRequest";

export const getFollowers = async (data: any) => {
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `user/followers`,
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

export const getFollowing = async (data: any) => {
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `user/following`,
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
