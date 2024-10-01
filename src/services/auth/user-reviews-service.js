import axiosAPI from "../axiosApi";

export async function getAllUserReviews(params = {}) {
  const response = await axiosAPI.get("user-reviews", { params: params });
  return response;
}

export async function getUserReviewById(id) {
  const response = await axiosAPI.get(`user-reviews/` + id);
  return response;
}

export async function postUserReview(data) {
  const response = await axiosAPI.post(`user-reviews`, data);
  return response;
}

export async function updateUserReview(id, data) {
  const response = await axiosAPI.put(`user-reviews/${id}`, data);
  return response;
}

export async function deleteUserReviewById(id) {
  const response = await axiosAPI.delete(`user-reviews/${id}`);
  return response;
}
