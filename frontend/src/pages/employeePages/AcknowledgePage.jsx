// src/pages/employeePages/AcknowledgePage.jsx
import React, { useEffect, useState } from 'react';
import { getFeedbackForEmployee } from '../../services/feedbackService';
import { acknowledgeFeedback } from '../../services/feedbackService';
import { getCurrentUser } from '../../services/authService';
import { formatDate } from '../../utils/utils';
import { useParams } from 'react-router-dom';

const AcknowledgePage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [acknowledging, setAcknowledging] = useState({});
  const { feedbackId } = useParams();

  useEffect(() => {
  const fetchFeedback = async () => {
    try {
      const currentUser = await getCurrentUser();
      const data = await getFeedbackForEmployee(currentUser.id);
      const selected = data.find(fb => fb.id === feedbackId);
      if (!selected) throw new Error("Feedback not found.");
      setFeedbacks([selected]);
    } catch (err) {
      setError("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };
  fetchFeedback();
}, [feedbackId]);

  const handleAcknowledge = async (feedbackId) => {
    setAcknowledging(prev => ({ ...prev, [feedbackId]: true }));
    
    try {
      await acknowledgeFeedback(feedbackId);
      // Refresh the feedback list to show updated acknowledgement status
      const currentUser = await getCurrentUser();
      const data = await getFeedbackForEmployee(currentUser.id);
      setFeedbacks(data);
    } catch (err) {
      setError('Failed to acknowledge feedback');
    } finally {
      setAcknowledging(prev => ({ ...prev, [feedbackId]: false }));
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600 bg-green-100';
      case 'negative':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Acknowledge Feedback</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {feedbacks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No feedback to acknowledge.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {feedbacks.map(feedback => (
            <div key={feedback.id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${getSentimentColor(feedback.sentiment)}`}>
                  {feedback.sentiment.charAt(0).toUpperCase() + feedback.sentiment.slice(1)}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDate(feedback.created_at)}
                </span>
              </div>
              
              {feedback.strengths && (
                <div className="mb-3">
                  <h4 className="font-medium text-green-700 mb-1">Strengths:</h4>
                  <p className="text-gray-700">{feedback.strengths}</p>
                </div>
              )}
              
              {feedback.areas_to_improve && (
                <div className="mb-3">
                  <h4 className="font-medium text-orange-700 mb-1">Areas to Improve:</h4>
                  <p className="text-gray-700">{feedback.areas_to_improve}</p>
                </div>
              )}
              
              <div className="flex justify-end mt-4">
                {feedback.acknowledgement ? (
                  <span className="text-green-600 text-sm font-medium">
                    ✓ Acknowledged on {formatDate(feedback.acknowledgement.acknowledged_at)}
                  </span>
                ) : (
                  <button
                    onClick={() => handleAcknowledge(feedback.id)}
                    disabled={acknowledging[feedback.id]}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
                  >
                    {acknowledging[feedback.id] ? 'Acknowledging...' : 'Acknowledge'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AcknowledgePage;
