import axiosAPI from "../axiosApi";

export async function getAllSparePartCarts(params = {}) {
  const response = await axiosAPI.get("spare-part-carts", { params: params });
  return response;
}

export async function postToSyncSpareCart(data) {
  const response = await axiosAPI.post(`sync-spare-carts`, data);
  return response;
}

export async function getSparePartCartById(id) {
  const response = await axiosAPI.get(`spare-part-carts/` + id);
  return response;
}

export async function postSparePartCart(data) {
  const response = await axiosAPI.post(`spare-part-carts`, data);
  return response;
}

export async function postSparePartCartBulkDelete(data) {
  const response = await axiosAPI.post(`spare-cart-bulk-delete`, data);
  return response;
}

export async function updateSparePartCart(id, data) {
  const response = await axiosAPI.put(`spare-part-carts/${id}`, data);
  return response;
}

export async function deleteSparePartCartById(id) {
  const response = await axiosAPI.delete(`spare-part-carts/${id}`);
  return response;
}
