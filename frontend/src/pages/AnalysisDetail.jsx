import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { analysisAPI } from '../services/api';
import AnalysisResults from '../components/analysis/AnalysisResults';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';

const AnalysisDetail = () => {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await analysisAPI.getById(id);
        setAnalysis(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching analysis');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id]);

  if (loading) {
    return <Loading className="py-20" />;
  }

  if (error) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <p className="text-red-400 mb-4">{error}</p>
        <Link to="/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to="/dashboard" className="text-primary-400 hover:text-primary-300 flex items-center transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      <AnalysisResults analysis={analysis} />

      <div className="mt-8 text-center">
        <Link to="/analyze">
          <Button>Analyze Another Job</Button>
        </Link>
      </div>
    </div>
  );
};

export default AnalysisDetail;
