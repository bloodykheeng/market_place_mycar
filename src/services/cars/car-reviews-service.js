import axiosAPI from "../axiosApi";

export async function getAllCarReviews(params = {}) {
  const response = await axiosAPI.get("car-reviews", { params: params });
  return response;
}

export async function getCarReviewById(id) {
  const response = await axiosAPI.get(`car-reviews/` + id);
  return response;
}

export async function postCarReview(data) {
  const response = await axiosAPI.post(`car-reviews`, data);
  return response;
}

export async function updateCarReview(id, data) {
  const response = await axiosAPI.put(`car-reviews/${id}`, data);
  return response;
}

export async function deleteCarReviewById(id) {
  const response = await axiosAPI.delete(`car-reviews/${id}`);
  return response;
}
