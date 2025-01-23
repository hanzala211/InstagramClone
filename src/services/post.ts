import { sendRequest } from "../utils/sendRequest";

export const postCreate = async (data: any) => {
	const formData = new FormData();
	try {
		await Promise.all(
			data.croppedImages.map(async (item: string, index: number) => {
				const response = await fetch(item);
				const blob = await response.blob();
				formData.append('images', blob, `image${index}.jpg`);
			})
		);
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `post`,
			configs: {
				method: "POST",
				headers: {
					"Authorization": `${data.token}`,
				},
				body: formData
			}
		})
		return res;
	} catch (error) {
		console.error(error)
	}
}

export const captionCreate = async (data: any) => {
	const raw = JSON.stringify(data)
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `post/caption/${data.res.post._id}`,
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

export const postSave = async (data: any) => {
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `save/${data.selectedPost?._id}`,
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

export const postUnsave = async (data: any) => {
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `unsave/${data.selectedPost?._id}`,
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

export const postDelete = async (data: any) => {
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `post/${data.selectedPost?._id}`,
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


export const postUpdate = async (data: any) => {
	const raw = JSON.stringify(data.raw)
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `post/${data.selectedPost?._id}`,
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

export const commentPost = async (data: any) => {
	const raw = JSON.stringify(data.raw)
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `post/comment/${data.selectedPost?._id}`,
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

export const getExplorePosts = async (data: any) => {
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `explore?limit=6`,
			configs: {
				method: "GET",
				headers: {
					"Authorization": `${data.token}`,
					'Content-Type': 'application/json',
				},
			}
		})
		return res;
	} catch (error) {
		console.error(error)
	}
}

export const getComments = async (data: any) => {
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `post/comments/${data.selectedPost?._id
				}?page=${data.page}&limit=15`,
			configs: {
				method: "GET",
				headers: {
					"Authorization": `${data.token}`,
					'Content-Type': 'multipart/form-data',
				},
				signal: data.signal
			}
		})
		return res;
	} catch (error) {
		console.error(error)
	}
}

export const postLike = async (data: any) => {
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `post/like/${data.selectedPost?._id}`,
			configs: {
				method: "POST",
				headers: {
					"Authorization": `${data.token}`,
					'Content-Type': 'application/json',
				},
				signal: data.signal
			}
		})
		return res;
	} catch (error) {
		console.error(error)
	}
}

export const postDislike = async (data: any) => {
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `post/dislike/${data.selectedPost?._id}`,
			configs: {
				method: "POST",
				headers: {
					"Authorization": `${data.token}`,
					'Content-Type': 'application/json',
				},
				signal: data.signal
			}
		})
		return res;
	} catch (error) {
		console.error(error)
	}
}

