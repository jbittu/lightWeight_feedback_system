// src/pages/managerPages/EditFeedbackPage.jsx
import React, { useEffect, useState } from "react";
import { getFeedbackById, updateFeedback } from "../../services/feedbackService";
import { useParams, useNavigate } from "react-router-dom";

const EditFeedbackPage = () => {
  const { feedbackId } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    strengths: "",
    areas_to_improve: "",
    sentiment: "neutral"
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        const fb = await getFeedbackById(feedbackId);
        setFormData({
          strengths: fb.strengths || "",
          areas_to_improve: fb.areas_to_improve || "",
          sentiment: fb.sentiment || "neutral"
        });
      } catch (err) {
        setError("Failed to load feedback.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadFeedback();
  }, [feedbackId]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateFeedback(feedbackId, formData);
      navigate("/manager/feedbacks");  // or back to dashboard
    } catch (err) {
      setError("Failed to update feedback.");
      console.error(err);
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Edit Feedback</h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          name="strengths"
          value={formData.strengths}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Strengths"
        />
        <textarea
          name="areas_to_improve"
          value={formData.areas_to_improve}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Areas to Improve"
        />
        <select
          name="sentiment"
          value={formData.sentiment}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="positive">Positive</option>
          <option value="neutral">Neutral</option>
          <option value="negative">Negative</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update Feedback
        </button>
      </form>
    </div>
  );
};

export default EditFeedbackPage;
