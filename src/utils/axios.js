import axios from "axios"

export const Slack = axios.create({
    baseURL: "http://206.189.91.54/api/v1",
    headers: {
        'Content-Type': 'application/json',
        'access-token': localStorage.getItem("access-token") || '',
        'uid': localStorage.getItem("uid") || '',
        'expiry': localStorage.getItem("expiry") || '',
        'client': localStorage.getItem("client") || '',
    }
})    