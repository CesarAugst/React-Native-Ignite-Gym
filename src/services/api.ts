import axios from "axios";

import { AppError } from "@utils/AppError";

const ip = '192.168.15.4';
//const ip = '192.168.15.177';

const api = axios.create({
    baseURL: `http://${ip}:3333`,

});

api.interceptors.response.use(response => response, error => {
    if(error.response && error.response.data){
        return Promise.reject(new AppError(error.response.data.message));
    }else{
        return Promise.reject(error)
    }
})

export { api }