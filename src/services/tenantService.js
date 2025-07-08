import axios from 'axios';

const API = 'http://YOUR_LOCAL_IP:3000/api';

export const getTenants = async () => {
  const res = await axios.get(`${API}/tenants`);
  return res.data;
};

export const addTenant = async (data) => {
  const res = await axios.post(`${API}/tenants`, data);
  return res.data;
};
