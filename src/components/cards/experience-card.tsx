import React, { Fragment } from 'react';
import { type SanitizedExperience } from '@/interfaces/sanitized-config';
import { skeleton } from '@/utils';

const ListItem = ({
  from,
  to,
  position,
  company,
  companyLink,
  description,
}: {
  from: React.ReactNode;
  to: React.ReactNode;
  position?: React.ReactNode;
  company?: React.ReactNode;
  companyLink?: string;
  description?: string;
}) => (
  <div className="space-y-2">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
      <h4 className="font-semibold text-base">{position || 'Role'}</h4>
      <span className="text-sm text-base-content/70">
        {from} - {to}
      </span>
    </div>
    <div className="text-sm text-primary">
      {companyLink ? (
        <a
          href={companyLink}
          target="_blank"
          rel="noreferrer"
          className="link link-hover"
        >
          {company}
        </a>
      ) : (
        company
      )}
    </div>
    <p className="text-sm text-base-content/80">
      {description || 'No description available.'}
    </p>
  </div>
);

const ExperienceCard = ({
  experiences,
  loading,
}: {
  experiences: SanitizedExperience[];
  loading: boolean;
}) => {
  const renderSkeleton = () => {
    const array = [];
    for (let index = 0; index < 2; index++) {
      array.push(
        <ListItem
          key={index}
          from={skeleton({
            widthCls: 'w-5/12',
            heightCls: 'h-4',
          })}
          to={skeleton({
            widthCls: 'w-5/12',
            heightCls: 'h-4',
          })}
          position={skeleton({
            widthCls: 'w-6/12',
            heightCls: 'h-4',
            className: 'my-1.5',
          })}
          company={skeleton({ widthCls: 'w-6/12', heightCls: 'h-3' })}
          description="..."
        />,
      );
    }

    return array;
  };
  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm">
      <div className="card-body">
        <div className="pb-4 border-b border-base-300">
          <h3 className="font-semibold card-title">
            {loading ? (
              skeleton({ widthCls: 'w-32', heightCls: 'h-8' })
            ) : (
              <span className="text-base-content opacity-70">
                Work Experience
              </span>
            )}
          </h3>
        </div>
        <div className="space-y-6 pt-4">
          {loading
            ? renderSkeleton()
            : experiences.map((experience, index) => (
                <Fragment key={index}>
                  <ListItem
                    key={index}
                    from={experience.from}
                    to={experience.to}
                    position={experience.position}
                    company={experience.company}
                    companyLink={
                      experience.companyLink
                        ? experience.companyLink
                        : undefined
                    }
                    description={experience.description}
                  />
                  {index < experiences.length - 1 && (
                    <hr className="w-[30%] border-t mx-auto border-base-300" />
                  )}
                </Fragment>
              ))}
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
