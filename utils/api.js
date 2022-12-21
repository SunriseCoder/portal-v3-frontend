import axios from 'axios';

// TODO: Move API call to a separate file like this one
export default {
    // Generating URL like: http://localhost:8080/api
    /*const urlPrefix: process.env.BACKEND_PROTOCOL + '://'
        + process.env.BACKEND_HOST + ':'
        + process.env.BACKEND_PORT + '/'
        + process.env.BACKEND_API_PREFIX,*/

    get(path) {
        url = this.urlPrefix + path;
        return axios.get("http://localhost:8000/api/events/complex");
        //return axios.get(url);
    }
};
