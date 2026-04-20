import 'github-markdown-css/github-markdown.css';

export const ReadmeViewer = ({ htmlContent }: { htmlContent: string }) => {
  return (
    <div className="markdown-body rounded-box mx-auto w-full max-w-5xl px-4 py-8 md:px-8 md:py-10">
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
};
