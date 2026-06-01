import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analysisAPI } from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

const Dashboard = () => {
  const { user } = useAuth();
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentAnalyses = async () => {
      try {
        const response = await analysisAPI.getHistory();
        setRecentAnalyses(response.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching analyses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentAnalyses();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20';
    if (score >= 60) return 'from-amber-500/20 to-amber-500/5 border-amber-500/20';
    if (score >= 40) return 'from-orange-500/20 to-orange-500/5 border-orange-500/20';
    return 'from-red-500/20 to-red-500/5 border-red-500/20';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Welcome back, <span className="gradient-text">{user?.name}</span>
        </h1>
        <p className="text-gray-400 mt-2">
          Here's your career intelligence overview
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            icon: (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            ),
            value: recentAnalyses.length,
            label: 'Total Analyses',
            color: 'from-primary-500 to-primary-600'
          },
          {
            icon: (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            ),
            value: recentAnalyses.length > 0
              ? `${Math.round(recentAnalyses.reduce((acc, a) => acc + a.jobFitScore, 0) / recentAnalyses.length)}%`
              : 'N/A',
            label: 'Average Score',
            color: 'from-accent-500 to-accent-600'
          },
          {
            icon: (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            ),
            value: recentAnalyses.length > 0
              ? Math.max(...recentAnalyses.map(a => a.jobFitScore)) + '%'
              : 'N/A',
            label: 'Best Score',
            color: 'from-emerald-500 to-emerald-600'
          }
        ].map((stat, i) => (
          <div key={i} className="glass rounded-2xl p-6 hover:bg-white/[0.06] transition-all duration-300">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-4`}>
              {stat.icon}
            </div>
            <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
            <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Recent Analyses</h2>
        <Link to="/analyze">
          <Button>New Analysis</Button>
        </Link>
      </div>

      {loading ? (
        <Loading className="py-12" />
      ) : recentAnalyses.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No analyses yet</h3>
          <p className="text-gray-400 mb-6">Start by uploading your resume and analyzing a job description</p>
          <Link to="/analyze">
            <Button>Create Your First Analysis</Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {recentAnalyses.map((analysis) => (
            <Link key={analysis._id} to={`/analysis/${analysis._id}`}>
              <Card hover className="h-full">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-white text-lg truncate">
                      {analysis.jobTitle}
                    </h3>
                    {analysis.companyName && (
                      <p className="text-gray-400 text-sm mt-1">{analysis.companyName}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {new Date(analysis.createdAt).toLocaleDateString()}
                    </span>
                    <span className={`text-2xl font-bold ${getScoreColor(analysis.jobFitScore)}`}>
                      {analysis.jobFitScore}%
                    </span>
                  </div>
                  <div className={`h-1 rounded-full bg-gradient-to-r ${getScoreBg(analysis.jobFitScore)}`}></div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
