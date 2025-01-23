export const sendRequest = async (data: any) => {
    try {
        const response = await fetch(`${data.baseUrl}${data.endPoint}`, {
            ...data.configs
        })
        const result = await response.json()
        return result;
    } catch (err) {
        console.error(err)
    }
}