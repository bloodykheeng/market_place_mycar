import axiosAPI from "../axiosApi";

export async function getAllSparePartTranctions(params = {}) {
  const response = await axiosAPI.get("spare-parts-transactions", {
    params: params
  });
  return response;
}

export async function getSparePartTranctionById(id) {
  const response = await axiosAPI.get(`spare-parts-transactions/` + id);
  return response;
}

export async function postSparePartTranction(data) {
  const response = await axiosAPI.post(`spare-parts-transactions`, data);
  return response;
}

export async function updateSparePartTranction(id, data) {
  const response = await axiosAPI.put(`spare-parts-transactions/${id}`, data);
  return response;
}

export async function deleteSparePartTranctionById(id) {
  const response = await axiosAPI.delete(`spare-parts/${id}`);
  return response;
}
