const StrengthsWeaknesses = ({ strengths, weaknesses }) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="glass rounded-2xl p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-emerald-400 flex items-center">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center mr-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            Strengths
          </h3>
          <ul className="space-y-3">
            {strengths?.map((strength, index) => (
              <li key={index} className="flex items-start text-gray-300">
                <span className="text-emerald-400 mr-3 mt-0.5">+</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-red-400 flex items-center">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center mr-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            Areas for Improvement
          </h3>
          <ul className="space-y-3">
            {weaknesses?.map((weakness, index) => (
              <li key={index} className="flex items-start text-gray-300">
                <span className="text-red-400 mr-3 mt-0.5">-</span>
                <span>{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StrengthsWeaknesses;
