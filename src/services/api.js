import axios from "axios";

export const api = axios.create({
    // point to the real backend running locally (default port 3334)
    baseURL: "http://localhost:3334"
});