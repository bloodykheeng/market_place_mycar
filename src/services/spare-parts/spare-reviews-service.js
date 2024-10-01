import axiosAPI from "../axiosApi";

export async function getAllSparePartReviews(params = {}) {
  const response = await axiosAPI.get("spare-reviews", { params: params });
  return response;
}

export async function getSparePartReviewById(id) {
  const response = await axiosAPI.get(`spare-reviews/` + id);
  return response;
}

export async function postSparePartReview(data) {
  const response = await axiosAPI.post(`spare-reviews`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response;
}

export async function updateSparePartReview(id, data) {
  const response = await axiosAPI.put(`spare-reviews/${id}`, data);
  return response;
}

export async function deleteSparePartReviewById(id) {
  const response = await axiosAPI.delete(`spare-reviews/${id}`);
  return response;
}
