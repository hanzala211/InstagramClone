import { sendRequest } from "../utils/sendRequest";

export const homePostSave = async (data: any) => {
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `save/${data.id}`,
			configs: {
				method: "POST",
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


export const homePostUnsave = async (data: any) => {
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `unsave/${data.id}`,
			configs: {
				method: "POST",
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


export const homePostLike = async (data: any) => {
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `post/like/${data.id}`,
			configs: {
				method: "POST",
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

export const homePostDislike = async (data: any) => {
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `post/dislike/${data.id}`,
			configs: {
				method: "POST",
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

export const getHomePosts = async (data: any) => {
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `home?limit=5`,
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

export const getHomeStories = async (data: any) => {
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `story/following`,
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
