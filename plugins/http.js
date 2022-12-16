import axios from 'axios';

axios.defaults.timeout = 30000;

let host = process.env.BASE_URL || '';

let object = {};

object.catch = (e) => {

};

object.request = (method, url, params = {},retry=0)=>{
    let options = {
        method:method,
        url:`${host}${url}`
    };

    if (method === 'post' || method === 'put'){
        options.data = params;
    } else{
        options.params = params;
    }

    return axios(options)
    .then(res => {
        return Promise.resolve(res);
    }).catch(e =>{
        return object.catch(e);
    });
};

object.login = (params)=>{
    return object.request('post','',params);
};

object.reservate = (params)=>{
    return object.request('post','',params);
};

export default object;