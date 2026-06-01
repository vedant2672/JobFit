import Badge from '../common/Badge';

const SkillsList = ({ title, skills, variant = 'primary' }) => {
  if (!skills || skills.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <Badge key={index} variant={variant}>
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default SkillsList;
