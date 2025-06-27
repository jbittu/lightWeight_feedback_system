// src/components/AcknowledgeButton.jsx
const AcknowledgeButton = ({ acknowledged, onAcknowledge }) => {
  if (acknowledged) {
    return <span className="text-green-600">Acknowledged</span>;
  }
  return (
    <button
      className="px-2 py-1 bg-green-500 text-white rounded"
      onClick={onAcknowledge}
    >
      Acknowledge
    </button>
  );
};

export default AcknowledgeButton;