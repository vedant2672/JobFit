const ScoreCircle = ({ score, size = 200 }) => {
  const radius = (size - 20) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (score) => {
    if (score >= 80) return { stroke: '#34d399', glow: 'rgba(52, 211, 153, 0.3)' };
    if (score >= 60) return { stroke: '#fbbf24', glow: 'rgba(251, 191, 36, 0.3)' };
    if (score >= 40) return { stroke: '#f97316', glow: 'rgba(249, 115, 22, 0.3)' };
    return { stroke: '#f87171', glow: 'rgba(248, 113, 113, 0.3)' };
  };

  const { stroke, glow } = getColor(score);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{ filter: `drop-shadow(0 0 8px ${glow})` }}
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-5xl font-black text-white">
          {score}
        </span>
        <span className="text-2xl font-bold text-gray-400">%</span>
        <p className="text-gray-500 text-sm mt-1 font-medium">Job Fit</p>
      </div>
    </div>
  );
};

export default ScoreCircle;
