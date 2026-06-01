const Card = ({ children, className = '', padding = true, hover = false }) => {
  return (
    <div className={`glass rounded-2xl ${padding ? 'p-6' : ''} ${hover ? 'hover:bg-white/[0.08] hover:glow-sm transition-all duration-300 cursor-pointer' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
