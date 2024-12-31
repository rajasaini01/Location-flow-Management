import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

export const saveAddress = (address) => API.post('/addresses', address);
export const getAddresses = () => API.get('/addresses');
export const deleteAddress = (id) => API.delete(`/addresses/${id}`);
export const reverseGeocode = (coords) => {
    console.log(coords);
    return API.post('/addresses/reverse-geocode', coords);
}
