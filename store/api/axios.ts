import axios from "axios";

// Use first-party proxy to avoid third-party cookie issues
const BASE_URL = '/api'

export const APIClient = axios.create({
    baseURL: BASE_URL, withCredentials: true, headers: { "Content-Type": "application/json", },
});
export const FormDataAPI = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "multipart/form-data", },
});

// --- CSRF Token Management ---
let csrfToken: string | null = null;
export const fetchAndSetCSRFToken = async () => {
    try {
        const { data } = await APIClient.get('/auth/csrf-token');
        csrfToken = data?.csrfToken;
        if (csrfToken) {
            APIClient.defaults.headers['X-CSRF-Token'] = csrfToken;
        }
    } catch (err) {
        // Optionally handle error
    }
};

// --- Token/Session Management ---
// Note: Interceptors will be setup separately to avoid circular dependencies

export default APIClient;