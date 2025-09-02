import axios from 'axios'

const baseURL = process.env.REACT_APP_API_URL

const httpClient = axios.create({
    baseURL: baseURL,
    withCredentials: true
})

class ApiService {

    constructor(apiurl) {
        this.apiurl = apiurl;
    }

    static registrarToken(token) {
        if (token) {
            httpClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
    }

    post(url, objeto) {
        const reqUrl = `${this.apiurl}${url}`
        return httpClient.post(reqUrl, objeto)
    }

    put(url, objeto) {
        const reqUrl = `${this.apiurl}${url}`
        return httpClient.put(reqUrl, objeto)
    }

    delete(url) {
        const reqUrl = `${this.apiurl}${url}`
        return httpClient.delete(reqUrl)
    }

    get(url) {
        const reqUrl = `${this.apiurl}${url}`
        return httpClient.get(reqUrl)
    }

}

export default ApiService