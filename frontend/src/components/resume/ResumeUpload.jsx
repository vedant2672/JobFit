import { useState } from 'react';
import { resumeAPI } from '../../services/api';
import Button from '../common/Button';
import Loading from '../common/Loading';

const ResumeUpload = ({ onResumeUploaded }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a PDF file');
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await resumeAPI.upload(formData);
      setSuccess('Resume uploaded and analyzed successfully!');
      setFile(null);
      if (onResumeUploaded) {
        onResumeUploaded(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading resume');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Upload Resume</h2>
        <p className="text-gray-400 text-sm">Upload your resume in PDF format for analysis</p>

        <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-primary-500/30 transition-all duration-300 group cursor-pointer bg-white/[0.02] hover:bg-white/[0.04]">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id="resume-upload"
          />
          <label htmlFor="resume-upload" className="cursor-pointer">
            <div className="space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium">
                  {file ? file.name : 'Click to select a PDF file'}
                </p>
                <p className="text-gray-500 text-sm mt-1">PDF only, max 5MB</p>
              </div>
            </div>
          </label>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-sm">
            {success}
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full"
        >
          {uploading ? (
            <span className="flex items-center justify-center">
              <Loading size="sm" className="mr-2" />
              Processing...
            </span>
          ) : (
            'Upload & Analyze'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ResumeUpload;
