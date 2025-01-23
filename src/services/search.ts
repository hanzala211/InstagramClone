import { sendRequest } from "../utils/sendRequest";


export const getSearch = async (data: any) => {
	try {
		const res = await sendRequest({
			baseUrl: `${import.meta.env.VITE_APP_URL}`,
			endPoint: `user/search/${data.searchQuery}`,
			configs: {
				method: "GET",
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
