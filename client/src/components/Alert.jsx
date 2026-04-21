import { useEffect, useState } from "react";

const Alert = ({ type = "success", message, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible || !message) return null;

  const styles = {
    success: "bg-green-50 border-green-400 text-green-800",
    error: "bg-red-50 border-red-400 text-red-800",
    info: "bg-blue-50 border-blue-400 text-blue-800",
  };

  return (
    <div className={`border-l-4 p-4 rounded-r-lg mb-4 ${styles[type]}`} role="alert">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={() => {
            setVisible(false);
            if (onClose) onClose();
          }}
          className="ml-4 text-lg leading-none hover:opacity-70"
          aria-label="Close alert"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Alert;
