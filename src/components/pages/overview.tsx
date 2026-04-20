import { type ReactNode } from 'react';
import { type SanitizedConfig } from '@/interfaces/sanitized-config';
import { type Profile } from '@/interfaces';
import LazyImage from '@/components/common/lazy-image';
import { ReadmeViewer } from '@/components/common/readme-viewer';

export const renderOverviewPage = ({
  sanitizedConfig,
  profile,
  readme,
  socialLinks,
}: {
  sanitizedConfig: SanitizedConfig | Record<string, never>;
  profile: Profile | null;
  readme: string;
  socialLinks: {
    key: string;
    label: string;
    href: string;
    value: string;
    icon: ReactNode;
  }[];
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <aside className={`${readme ? 'lg:col-span-4' : 'col-span-12'} space-y-6`}>
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="avatar">
              <div className="w-28 rounded-full ring ring-base-300 ring-offset-base-100 ring-offset-2">
                {profile ? (
                  <LazyImage
                    src={profile.avatar}
                    alt={profile.name}
                    placeholder={
                      <div className="w-full h-full bg-base-300 animate-pulse" />
                    }
                  />
                ) : (
                  <div className="w-full h-full bg-base-300 animate-pulse" />
                )}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {profile?.name || sanitizedConfig.github.username}
              </h2>
              <p className="text-base-content/70">
                @{sanitizedConfig.github.username}
              </p>
              {profile?.bio && (
                <p className="mt-3 text-sm text-base-content/80">
                  {profile.bio}
                </p>
              )}
              {sanitizedConfig.skills && sanitizedConfig.skills.length > 0 && (
                <div className="flex items-center flex-wrap gap-2 pt-1">
                  {sanitizedConfig.skills.map((item) => (
                    <span
                      key={item}
                      className="badge badge-neutral badge-md text-xs"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {sanitizedConfig.resume.fileUrl && (
              <a
                href={sanitizedConfig.resume.fileUrl}
                target="_blank"
                download
                rel="noreferrer"
                className="btn btn-outline btn-sm"
              >
                Download Resume
              </a>
            )}
          </div>

          <div className="divider my-2" />

          <div className="space-y-2 text-sm">
            {profile?.company && (
              <p>
                <span className="font-semibold">Organization:</span>{' '}
                {profile.company}
              </p>
            )}
            {profile?.location && (
              <p>
                <span className="font-semibold">Location:</span>{' '}
                {profile.location}
              </p>
            )}
          </div>

          {!!socialLinks.length && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Socials</h3>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                {socialLinks.map((item) => (
                  <a
                    key={item.key}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-base-content/80 hover:text-primary"
                  >
                    <span className="text-base-content/60">{item.icon}</span>
                    <span className="font-medium">{item.value}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>

    {readme && (
      <section className="lg:col-span-8">
        <div className="card bg-base-100 border border-base-300 shadow-sm">
          <div className="card-body">
            <div className="pb-4 border-b border-base-300">
              <h3 className="font-semibold">README.md</h3>
            </div>
            <article className="prose prose-sm max-w-none pt-4">
              <ReadmeViewer htmlContent={readme} />
            </article>
          </div>
        </div>
      </section>
    )}
  </div>
);
