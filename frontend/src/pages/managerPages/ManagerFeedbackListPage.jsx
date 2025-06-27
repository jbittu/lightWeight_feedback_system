import React, { useEffect, useState } from "react";
import { getFeedbackByManager } from "../../services/feedbackService";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/utils";

const ManagerFeedbackListPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const data = await getFeedbackByManager();
        setFeedbacks(data);
      } catch (err) {
        console.error("Failed to fetch feedbacks", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Your Submitted Feedback</h2>
      {feedbacks.length === 0 ? (
        <p>No feedback submitted yet.</p>
      ) : (
        <ul className="space-y-4">
          {feedbacks.map((fb) => (
            <li key={fb.id} className="border p-4 rounded shadow-sm bg-white">
              <p><strong>Employee:</strong> {fb.employee?.name || fb.employee_id}</p>
              <p><strong>Sentiment:</strong> {fb.sentiment}</p>
              <p><strong>Date:</strong> {formatDate(fb.created_at)}</p>
              <Link
                to={`/manager/feedback/edit/${fb.id}`}
                className="text-blue-600 hover:underline mt-2 inline-block"
              >
                Edit Feedback
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManagerFeedbackListPage;
