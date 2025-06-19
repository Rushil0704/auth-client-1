import React from "react";

const Spinner: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-800">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
    </div>
  );
};

export default Spinner;
