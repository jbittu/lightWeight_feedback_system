// src/services/feedbackService.js
import API from "./api";

// Create new feedback
export const createFeedback = async (feedback) => {
  const response = await API.post("/feedback", feedback);
  return response.data;
};

// Get feedback list for an employee
export const getFeedbackForEmployee = async (employeeId) => {
  const response = await API.get(`/feedback/employee/${employeeId}`);
  return response.data;
};

// ✅ Get all feedbacks submitted by the manager
export const getFeedbackByManager = async () => {
  const response = await API.get("/feedback/manager/all");
  return response.data;
};

// ✅ Get a single feedback by ID (manager view/edit)
export const getFeedbackById = async (feedbackId) => {
  const response = await API.get(`/feedback/single/${feedbackId}`);
  return response.data;
};

// Update feedback (manager only)
export const updateFeedback = async (id, data) => {
  const res = await API.patch(`/feedback/${id}`, data);
  return res.data;
};

// Employee acknowledges feedback
export const acknowledgeFeedback = async (feedbackId) => {
  const response = await API.patch(`/feedback/${feedbackId}/acknowledge`);
  return response.data;
};
