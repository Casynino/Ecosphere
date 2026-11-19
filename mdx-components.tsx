import type { MDXComponents } from 'mdx/types';

// Styles for the HTML elements produced by news articles written in MDX.
const components: MDXComponents = {
  h2: (props) => <h2 className="mt-10 font-display text-2xl text-ink sm:text-3xl" {...props} />,
  h3: (props) => <h3 className="mt-8 font-display text-xl text-ink" {...props} />,
  p: (props) => <p className="mt-5 text-lg leading-relaxed text-muted" {...props} />,
  ul: (props) => <ul className="mt-5 list-disc space-y-2 pl-6 text-lg text-muted" {...props} />,
  ol: (props) => <ol className="mt-5 list-decimal space-y-2 pl-6 text-lg text-muted" {...props} />,
  a: (props) => <a className="font-semibold text-teal underline underline-offset-4 hover:text-teal-dark" {...props} />,
  blockquote: (props) => (
    <blockquote className="mt-6 border-l-4 border-lime pl-5 text-lg italic text-ink" {...props} />
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
