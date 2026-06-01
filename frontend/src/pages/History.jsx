import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analysisAPI } from '../services/api';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

const History = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const response = await analysisAPI.getHistory();
        setAnalyses(response.data);
      } catch (error) {
        console.error('Error fetching analyses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 60) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    if (score >= 40) return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
    return 'text-red-400 bg-red-500/10 border-red-500/20';
  };

  if (loading) {
    return <Loading className="py-20" />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Analysis History</h1>
          <p className="text-gray-400 mt-2">View all your previous job fit analyses</p>
        </div>
        <Link to="/analyze">
          <Button>New Analysis</Button>
        </Link>
      </div>

      {analyses.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No analyses yet</h3>
          <p className="text-gray-400 mb-6">Start by analyzing your first job match</p>
          <Link to="/analyze">
            <Button>Create Your First Analysis</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {analyses.map((analysis) => (
            <Link key={analysis._id} to={`/analysis/${analysis._id}`}>
              <div className="glass rounded-2xl p-6 hover:bg-white/[0.06] transition-all duration-300 cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white group-hover:text-primary-300 transition-colors truncate">
                      {analysis.jobTitle}
                    </h3>
                    {analysis.companyName && (
                      <p className="text-gray-400 text-sm">{analysis.companyName}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(analysis.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-4 ml-4">
                    <div className="hidden md:flex items-center space-x-2">
                      {analysis.matchedSkills?.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="primary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {analysis.matchedSkills?.length > 3 && (
                        <span className="text-gray-500 text-xs">
                          +{analysis.matchedSkills.length - 3}
                        </span>
                      )}
                    </div>
                    
                    <div className={`px-4 py-2 rounded-xl font-bold text-lg border ${getScoreColor(analysis.jobFitScore)}`}>
                      {analysis.jobFitScore}%
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
