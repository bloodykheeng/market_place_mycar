import axiosAPI from "../axiosApi";

export async function getAllFaqs(params = {}) {
  const response = await axiosAPI.get("faqs", { params: params });
  return response;
}

export async function getFaqById(id) {
  const response = await axiosAPI.get(`faqs/` + id);
  return response;
}

export async function postFaq(data) {
  const response = await axiosAPI.post(`faqs`, data);
  return response;
}

export async function updateFaq(id, data) {
  const response = await axiosAPI.put(`faqs/${id}`, data);
  return response;
}

export async function deleteFaqById(id) {
  const response = await axiosAPI.delete(`faqs/${id}`);
  return response;
}
