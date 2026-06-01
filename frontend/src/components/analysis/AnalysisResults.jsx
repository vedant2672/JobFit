import ScoreCircle from './ScoreCircle';
import SkillsList from './SkillsList';
import StrengthsWeaknesses from './StrengthsWeaknesses';
import Roadmap from './Roadmap';
import OutreachMessages from './OutreachMessages';

const AnalysisResults = ({ analysis }) => {
  if (!analysis) {
    return null;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          {analysis.jobTitle}
          {analysis.companyName && <span className="text-gray-400"> at {analysis.companyName}</span>}
        </h2>
        <p className="text-gray-500">Analysis completed on {new Date(analysis.createdAt).toLocaleDateString()}</p>
      </div>

      <div className="flex justify-center animate-scale-in">
        <ScoreCircle score={analysis.jobFitScore} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <SkillsList
            title="Matched Skills"
            skills={analysis.matchedSkills}
            variant="success"
          />
        </div>

        <div className="glass rounded-2xl p-6">
          <SkillsList
            title="Missing Skills"
            skills={analysis.missingSkills}
            variant="danger"
          />
        </div>
      </div>

      <StrengthsWeaknesses
        strengths={analysis.strengths}
        weaknesses={analysis.weaknesses}
      />

      <div className="glass rounded-2xl p-6">
        <SkillsList
          title="Recommended Projects"
          skills={analysis.recommendedProjects}
          variant="accent"
        />
      </div>

      <Roadmap roadmap={analysis.roadmap} />

      <OutreachMessages analysisId={analysis._id} />
    </div>
  );
};

export default AnalysisResults;
