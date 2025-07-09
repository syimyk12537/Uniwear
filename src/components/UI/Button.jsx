const Button = ({ children, className = '', variant = 'default', ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors';
  
  const variantClasses = {
    default: 'bg-White text-black hover:bg-gray-400 border border-gray-900',
    outline: 'border border-gray-300 hover:bg-gray-50',
    primary: 'bg-black text-white hover:bg-gray-400',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;