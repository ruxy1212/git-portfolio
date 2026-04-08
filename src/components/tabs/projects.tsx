import { Dispatch, SetStateAction, useMemo } from 'react';
import LazyImage from '../lazy-image';
import { skeleton } from '../../utils';
import { HistoryIcon } from '@primer/octicons-react';
import { useSearchParams } from 'react-router-dom';
import ProjectFilter from '../project-filter';

type UnifiedProject = {
  id: string;
  type: 'github' | 'external';
  name: string;
  shortDescription: string;
  fullDescription?: string;
  year: string;
  stack: string[];
  categories?: string[];
  media: string[];
  link: string;
  repo: string;
};

export const ProjectsTab = ({
  unifiedProjects,
  expandedProjectId,
  setExpandedProjectId,
  screenshotApi,
}: {
  unifiedProjects: UnifiedProject[];
  expandedProjectId: string | null;
  setExpandedProjectId: Dispatch<SetStateAction<string | null>>;
  screenshotApi?: string;
}) => {
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get('category') ?? 'all';

  const filteredProjects = useMemo(() => {
    if (categorySlug === 'all') return unifiedProjects;

    if (categorySlug === 'uncategorized') {
      return unifiedProjects.filter(
        (p) => !Array.isArray(p.categories) || p.categories.length === 0,
      );
    }

    return unifiedProjects.filter(
      (p) => Array.isArray(p.categories) && p.categories.includes(categorySlug),
    );
  }, [unifiedProjects, categorySlug]);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <section className="lg:col-span-12 space-y-6">
        <div className="card bg-base-100 border border-base-300 shadow-sm overflow-hidden">
          <div className="bg-base-200 px-4 py-3 border-b border-base-300 font-semibold text-sm">
            <div className="flex justify-between">
              <span>Projects</span>
              <ProjectFilter projects={unifiedProjects} />
            </div>
          </div>
          <div className="divide-y divide-base-300">
            {filteredProjects.map((project) => {
              const isOpen = expandedProjectId === project.id;
              return (
                <div key={project.id}>
                  <button
                    type="button"
                    className="w-full text-left px-4 py-3 hover:bg-base-200 transition-colors"
                    onClick={() =>
                      setExpandedProjectId((current) =>
                        current === project.id ? null : project.id,
                      )
                    }
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                      <div className="sm:w-1/3 font-medium text-primary truncate">
                        {project.name}
                      </div>
                      <div className="sm:w-1/2 truncate text-base-content/80">
                        {project.shortDescription}
                      </div>
                      <div className="sm:w-1/6 text-base-content/70 sm:text-right">
                        {project.year}
                      </div>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="p-4">
                      <div className="card bg-base-100 border border-base-300 shadow-sm">
                        <div className="card-body">
                          <h4 className="font-semibold text-base">
                            {project.name}
                            <span className="ms-2 badge badge-neutral badge-sm text-xs">
                              {project.year}
                            </span>
                          </h4>
                          <p className="text-sm text-base-content/80">
                            {project.fullDescription ||
                              project.shortDescription}
                          </p>

                          <div className="flex items-center flex-wrap gap-2 pt-1">
                            {project.stack.map((item) => (
                              <span
                                key={item}
                                className="badge badge-neutral badge-md text-xs"
                              >
                                {item}
                              </span>
                            ))}
                          </div>

                          {project.type === 'github' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                              <div className="w-full overflow-hidden rounded-2xl group">
                                <LazyImage
                                  src={
                                    project.link
                                      ? `${screenshotApi}${project.link}`
                                      : '/project.png'
                                  }
                                  placeholder={skeleton({
                                    widthCls: 'w-full',
                                    heightCls: 'h-full',
                                    shape: '',
                                  })}
                                  alt="thumbnail"
                                  className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              </div>
                            </div>
                          )}

                          {!!project.media.length && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                              {project.media.map((item, index) => (
                                <div
                                  key={index}
                                  className="w-full overflow-hidden rounded-2xl group"
                                >
                                  <LazyImage
                                    src={item}
                                    placeholder={skeleton({
                                      widthCls: 'w-full',
                                      heightCls: 'h-full',
                                      shape: '',
                                    })}
                                    alt="thumbnail"
                                    className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex gap-2">
                            {project.link && (
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-sm btn-outline"
                              >
                                View Project
                              </a>
                            )}
                            {project.repo && (
                              <a
                                href={project.repo}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-sm btn-primary"
                              >
                                Open Repo
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
