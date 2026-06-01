const Button = ({ children, variant = 'primary', className = '', disabled = false, ...props }) => {
  const baseStyles = 'px-6 py-3 rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 hover:shadow-lg hover:shadow-primary-500/25 focus:ring-primary-500',
    secondary: 'glass text-white hover:bg-white/10 focus:ring-primary-500',
    accent: 'bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:from-accent-600 hover:to-accent-700 hover:shadow-lg hover:shadow-accent-500/25 focus:ring-accent-500',
    outline: 'border border-primary-500/30 text-primary-400 hover:bg-primary-500/10 focus:ring-primary-500',
    ghost: 'text-gray-400 hover:text-white hover:bg-white/5 focus:ring-primary-500',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
