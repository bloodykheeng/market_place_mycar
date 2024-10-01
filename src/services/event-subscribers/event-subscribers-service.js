import axiosAPI from "../axiosApi";

export async function getAllEventSubscribers(params = {}) {
  const response = await axiosAPI.get("event-subscribers", { params: params });
  return response;
}

export async function getEventSubscriberById(id) {
  const response = await axiosAPI.get(`event-subscribers/` + id);
  return response;
}

export async function postEventSubscriber(data) {
  const response = await axiosAPI.post(`event-subscribers`, data);
  return response;
}

export async function updateEventSubscriber(id, data) {
  const response = await axiosAPI.post(`event-subscribers/${id}`, data);
  return response;
}

export async function deleteEventSubscriberById(id) {
  const response = await axiosAPI.delete(`event-subscribers/${id}`);
  return response;
}
