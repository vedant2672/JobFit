import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { resumeAPI, analysisAPI } from '../services/api';
import ResumeUpload from '../components/resume/ResumeUpload';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

const Analyze = () => {
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onResumeUploaded = (resumeData) => {
    setResume(resumeData);
  };

  const onSubmit = async (data) => {
    if (!resume) {
      setError('Please upload a resume first');
      return;
    }

    setAnalyzing(true);
    setError('');

    try {
      const response = await analysisAPI.create({
        resumeId: resume._id,
        jobDescription: data.jobDescription,
        jobTitle: data.jobTitle || 'Untitled Position',
        companyName: data.companyName || ''
      });

      navigate(`/analysis/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating analysis');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white">Analyze Job Fit</h1>
        <p className="text-gray-400 mt-2">
          Upload your resume and paste a job description to get AI-powered insights
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <ResumeUpload onResumeUploaded={onResumeUploaded} />
        </div>

        <div className="glass rounded-2xl p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Job Details</h2>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <Input
              label="Job Title (Optional)"
              placeholder="e.g., Frontend Developer"
              {...register('jobTitle')}
            />

            <Input
              label="Company Name (Optional)"
              placeholder="e.g., Google"
              {...register('companyName')}
            />

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Job Description *
              </label>
              <textarea
                rows={10}
                placeholder="Paste the job description here..."
                className={`w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-300 resize-none ${
                  errors.jobDescription ? 'border-red-500/50 focus:ring-red-500/50' : ''
                }`}
                {...register('jobDescription', {
                  required: 'Job description is required'
                })}
              />
              {errors.jobDescription && (
                <p className="mt-2 text-sm text-red-400">{errors.jobDescription.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={analyzing || !resume}
            >
              {analyzing ? (
                <span className="flex items-center justify-center">
                  <Loading size="sm" className="mr-2" />
                  Analyzing...
                </span>
              ) : (
                'Analyze Job Fit'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Analyze;
