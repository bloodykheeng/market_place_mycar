import axiosAPI from "../axiosApi";

export async function getAllGarageReviews(params = {}) {
  const response = await axiosAPI.get("garage-reviews", { params: params });
  return response;
}

export async function getGarageReviewById(id) {
  const response = await axiosAPI.get(`garage-reviews/` + id);
  return response;
}

export async function postGarageReview(data) {
  const response = await axiosAPI.post(`garage-reviews`, data);
  return response;
}

export async function updateGarageReview(id, data) {
  const response = await axiosAPI.put(`garage-reviews/${id}`, data);
  return response;
}

export async function deleteGarageReviewById(id) {
  const response = await axiosAPI.delete(`garage-reviews/${id}`);
  return response;
}
