const Roadmap = ({ roadmap }) => {
  if (!roadmap || roadmap.length === 0) {
    return null;
  }

  return (
    <div className="glass rounded-2xl p-6">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <div className="w-8 h-8 rounded-lg bg-accent-500/10 flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          Learning Roadmap
        </h3>

        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-accent-500/50 via-primary-500/50 to-transparent"></div>
          
          <div className="space-y-6">
            {roadmap.map((item, index) => (
              <div key={index} className="relative flex items-start group">
                <div className="absolute left-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold z-10 group-hover:scale-110 transition-transform duration-300">
                  {index + 1}
                </div>
                <div className="ml-16 py-2">
                  <p className="text-gray-300 leading-relaxed">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
