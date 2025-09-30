import React from "react";

interface ButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
  ariaLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({ onClick, disabled = false, loading = false, children, variant = "primary", type = "button", ariaLabel }) => {
  const baseStyles = "px-6 py-3 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";

  const variants = {
    primary: `bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 
              disabled:bg-gray-400 disabled:cursor-not-allowed`,
    secondary: `bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 
                text-gray-900 dark:text-white focus:ring-gray-500`,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      aria-label={ariaLabel}
      aria-busy={loading}
    >
      {loading ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" aria-hidden="true"></div>
          <span>Processing...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};
