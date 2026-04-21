import type { Dispatch, FormEvent, SetStateAction } from 'react';

interface IssuesPageProps {
  // Use the exact signature from your parent component
  submitContactForm: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  contactLoading: boolean;
  contactMessage: {
    type: 'success' | 'error';
    text: string;
  } | null;
  issuesUrl: string;
  contactName: string;
  contactEmail: string;
  contactBody: string;

  // Setter functions
  setContactName: Dispatch<SetStateAction<string>>;
  setContactEmail: Dispatch<SetStateAction<string>>;
  setContactBody: Dispatch<SetStateAction<string>>;
  endpoint?: string;
}

export const renderIssuesPage = ({
  submitContactForm,
  contactMessage,
  contactLoading,
  issuesUrl,
  contactName,
  setContactName,
  contactEmail,
  setContactEmail,
  contactBody,
  setContactBody,
  endpoint,
}: IssuesPageProps) => (
  <div className="space-y-6">
    <div className="card bg-base-100 border border-base-300 shadow-sm">
      <div className="card-body">
        <h3 className="card-title">Contribute via Issues</h3>
        <p className="text-sm text-base-content/80">
          Found a bug, improvement, or collaboration idea? Open an issue in the
          repository and contribute.
        </p>
        <div>
          <a
            href={issuesUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-sm btn-primary"
          >
            Open Repository Issues
          </a>
        </div>
      </div>
    </div>

    {endpoint && (
      <div className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body">
          <h3 className="card-title">Contact Form</h3>
          <form className="space-y-4" onSubmit={submitContactForm}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="form-control w-full">
                <span className="label-text mb-1">Name</span>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={contactName}
                  onChange={(event) => setContactName(event.target.value)}
                  required
                />
              </label>
              <label className="form-control w-full">
                <span className="label-text mb-1">Email</span>
                <input
                  type="email"
                  className="input input-bordered w-full"
                  value={contactEmail}
                  onChange={(event) => setContactEmail(event.target.value)}
                  required
                />
              </label>
            </div>
            <label className="form-control w-full">
              <span className="label-text mb-1">Message</span>
              <textarea
                className="textarea textarea-bordered w-full min-h-36"
                value={contactBody}
                onChange={(event) => setContactBody(event.target.value)}
                required
              />
            </label>

            {contactMessage && (
              <div
                className={`mt-3 alert ${contactMessage.type === 'success' ? 'alert-success' : 'alert-error'}`}
              >
                <span>{contactMessage.text}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary mt-4"
              disabled={contactLoading}
            >
              {contactLoading ? 'Sending...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    )}
  </div>
);
