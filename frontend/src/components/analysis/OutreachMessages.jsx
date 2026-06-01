import { useState } from 'react';
import { analysisAPI } from '../../services/api';

const mainTabs = [
  { id: 'linkedin', label: 'LinkedIn DM' },
  { id: 'email', label: 'Cold Email' },
  { id: 'coverLetter', label: 'Cover Letter' }
];

const OutreachMessages = ({ analysisId }) => {
  const [activeTab, setActiveTab] = useState('linkedin');
  const [subTab, setSubTab] = useState(null);
  const [messages, setMessages] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const generateMessages = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await analysisAPI.generateOutreach(analysisId);
      setMessages(response.data);
      setSubTab(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error generating messages');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTextForCopy = () => {
    if (!messages) return '';
    if (activeTab === 'linkedin') {
      if (subTab === 'professional') return messages.linkedinProfessional;
      if (subTab === 'casual') return messages.linkedinCasual;
      if (subTab === 'bold') return messages.linkedinBold;
      return messages.linkedinProfessional || '';
    }
    if (activeTab === 'email') {
      return `Subject: ${messages.emailSubject}\n\n${messages.emailBody}`;
    }
    if (activeTab === 'coverLetter') {
      if (subTab === 'ats') return messages.coverLetterAts;
      if (subTab === 'human') return messages.coverLetterHuman;
      return messages.coverLetterAts || '';
    }
    return '';
  };

  const getDisplayText = () => {
    if (!messages) return '';
    if (activeTab === 'linkedin') {
      if (subTab === 'professional') return messages.linkedinProfessional;
      if (subTab === 'casual') return messages.linkedinCasual;
      if (subTab === 'bold') return messages.linkedinBold;
      return '';
    }
    if (activeTab === 'email') {
      return `Subject: ${messages.emailSubject}\n\n${messages.emailBody}`;
    }
    if (activeTab === 'coverLetter') {
      if (subTab === 'ats') return messages.coverLetterAts;
      if (subTab === 'human') return messages.coverLetterHuman;
      return '';
    }
    return '';
  };

  const getLinkedInSubTabs = () => [
    { id: 'professional', label: 'Professional', color: 'text-blue-400' },
    { id: 'casual', label: 'Casual', color: 'text-green-400' },
    { id: 'bold', label: 'Bold', color: 'text-orange-400' }
  ];

  const getCoverLetterSubTabs = () => [
    { id: 'ats', label: 'ATS-Friendly', color: 'text-purple-400' },
    { id: 'human', label: 'Human-Friendly', color: 'text-pink-400' }
  ];

  if (!messages && !loading) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <div className="mb-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center border border-primary-500/20">
            <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Generate Outreach Messages</h3>
        <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
          Get personalized LinkedIn DMs, cold emails, and cover letters tailored to this job based on your resume and analysis.
        </p>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <button
          onClick={generateMessages}
          className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300"
        >
          Generate Messages
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <div className="w-12 h-12 mx-auto mb-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400">Generating personalized messages...</p>
        <p className="text-gray-500 text-xs mt-2">This may take a moment — crafting 7 tailored messages</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl overflow-hidden">
      {/* Main tabs */}
      <div className="flex border-b border-white/5">
        {mainTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSubTab(null); }}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-white bg-white/5 border-b-2 border-primary-500'
                : 'text-gray-400 hover:text-gray-300 hover:bg-white/[0.02]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sub tabs for LinkedIn */}
      {activeTab === 'linkedin' && (
        <div className="flex border-b border-white/5 bg-black/20">
          {getLinkedInSubTabs().map((st) => (
            <button
              key={st.id}
              onClick={() => setSubTab(st.id)}
              className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                subTab === st.id
                  ? `text-white bg-white/5 border-b-2 ${st.color.replace('text-', 'border-')}`
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      )}

      {/* Sub tabs for Cover Letter */}
      {activeTab === 'coverLetter' && (
        <div className="flex border-b border-white/5 bg-black/20">
          {getCoverLetterSubTabs().map((st) => (
            <button
              key={st.id}
              onClick={() => setSubTab(st.id)}
              className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                subTab === st.id
                  ? `text-white bg-white/5 border-b-2 ${st.color.replace('text-', 'border-')}`
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      )}

      <div className="p-6">
        {/* LinkedIn content */}
        {activeTab === 'linkedin' && subTab && (
          <div>
            <div className="bg-black/30 rounded-xl p-5 whitespace-pre-wrap text-sm text-gray-300 leading-relaxed max-h-96 overflow-y-auto">
              {getDisplayText()}
            </div>
          </div>
        )}

        {/* Email content */}
        {activeTab === 'email' && (
          <div className="space-y-4">
            <div className="bg-black/30 rounded-xl p-5 whitespace-pre-wrap text-sm text-gray-300 leading-relaxed max-h-96 overflow-y-auto">
              {getDisplayText()}
            </div>
            {messages.emailExplanation && (
              <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-5">
                <h4 className="text-xs font-semibold text-primary-400 uppercase tracking-wider mb-2">Why This Works</h4>
                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{messages.emailExplanation}</p>
              </div>
            )}
          </div>
        )}

        {/* Cover Letter content */}
        {activeTab === 'coverLetter' && subTab && (
          <div>
            <div className="bg-black/30 rounded-xl p-5 whitespace-pre-wrap text-sm text-gray-300 leading-relaxed max-h-96 overflow-y-auto">
              {getDisplayText()}
            </div>
          </div>
        )}

        {/* Placeholder when no sub-tab selected */}
        {((activeTab === 'linkedin' && !subTab) || (activeTab === 'coverLetter' && !subTab)) && (
          <div className="text-center py-8 text-gray-500 text-sm">
            Select a version above to view
          </div>
        )}

        {/* Copy button - always visible when there's content */}
        {getDisplayText() && (
          <button
            onClick={() => handleCopy(getTextForCopy())}
            className={`mt-4 w-full py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
              copied
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20'
            }`}
          >
            {copied ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied to Clipboard
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy to Clipboard
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default OutreachMessages;
