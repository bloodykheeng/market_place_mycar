import axiosAPI from "../axiosApi";

export async function getAllCarCarts(params = {}) {
  const response = await axiosAPI.get("car-carts", { params: params });
  return response;
}

export async function postToSyncCarCart(data) {
  const response = await axiosAPI.post(`sync-car-carts`, data);
  return response;
}

export async function getCarCartById(id) {
  const response = await axiosAPI.get(`car-carts/` + id);
  return response;
}

export async function postCarCart(data) {
  const response = await axiosAPI.post(`car-carts`, data);
  return response;
}

export async function updateCarCart(id, data) {
  const response = await axiosAPI.put(`car-carts/${id}`, data);
  return response;
}

export async function deleteCarCartById(id) {
  const response = await axiosAPI.delete(`car-carts/${id}`);
  return response;
}
