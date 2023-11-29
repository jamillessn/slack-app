export const getHeaders = () => {
    return {
        accessToken: localStorage.getItem('access-token'),
        client: localStorage.getItem('client'),
        expiry: localStorage.getItem('expiry'),
        uid: localStorage.getItem('uid'),
    }
}