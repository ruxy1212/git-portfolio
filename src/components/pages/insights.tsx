import { type SanitizedConfig } from '@/interfaces/sanitized-config';
import CertificationCard from '@/components/cards/certification-card';
import ExperienceCard from '@/components/cards/experience-card';

export const renderInsightsPage = ({
  sanitizedConfig,
  loading,
}: {
  sanitizedConfig: SanitizedConfig | Record<string, never>;
  loading: boolean;
}) => {
  return (
    <div className="space-y-6">
      <div className="card bg-base-100 border border-base-300 shadow-sm overflow-hidden">
        <div className="bg-base-200 px-4 py-3 border-b border-base-300 font-semibold text-sm">
          Education
        </div>
        <div className="divide-y divide-base-300">
          {sanitizedConfig.educations.map((education, index) => (
            <div
              key={index}
              className="px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 text-sm"
            >
              <div className="sm:w-1/3 font-medium text-primary">
                {education.degree || 'Degree'}
              </div>
              <div className="sm:w-1/2 truncate">{education.institution}</div>
              <div className="sm:w-1/6 text-base-content/70 sm:text-right">
                {education.from} - {education.to}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-8">
          <ExperienceCard
            experiences={sanitizedConfig.experiences}
            loading={loading}
          />
        </section>

        <aside className="lg:col-span-4">
          <CertificationCard
            loading={loading}
            certifications={sanitizedConfig.certifications}
          />
        </aside>
      </div>
    </div>
  );
};
