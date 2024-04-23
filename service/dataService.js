import axios from 'axios';

axios.defaults.baseURL = 'https://online-store-service.onrender.com';

export const getAllItems = async () => {
  const { data } = await axios.get('/api/items');
  return data;
};

export const getItemsByTag = async tag => {
  const { data } = await axios.get('/api/items/tag/' + tag)
  return data
}

export const getAllStatic = async () => {
  const { data } = await axios.get('/api/items/photoType/static')
  return data
}

export const getAllLive = async () => {
  const { data } = await axios.get('/api/items/photoType/live')
  return data
}
