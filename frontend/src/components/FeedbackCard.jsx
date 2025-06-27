
const FeedbackCard = ({ feedback }) => {
  return (
    <div className="border rounded-xl p-4 shadow">
      <p><strong>Sentiment:</strong> {feedback.sentiment}</p>
      <p><strong>Strengths:</strong> {feedback.strengths}</p>
      <p><strong>Areas to Improve:</strong> {feedback.areas_to_improve}</p>
      <p className="text-sm text-gray-500">Created at: {new Date(feedback.created_at).toLocaleString()}</p>
    </div>
  );
};

export default FeedbackCard;