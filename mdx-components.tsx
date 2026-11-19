import type { MDXComponents } from 'mdx/types';

// Styles for the HTML elements produced by news articles written in MDX.
const components: MDXComponents = {
  h2: (props) => <h2 className="mt-10 font-display text-2xl text-snow sm:text-3xl" {...props} />,
  h3: (props) => <h3 className="mt-8 font-display text-xl text-snow" {...props} />,
  p: (props) => <p className="mt-5 text-lg leading-relaxed text-mist" {...props} />,
  ul: (props) => <ul className="mt-5 list-disc space-y-2 pl-6 text-lg text-mist" {...props} />,
  ol: (props) => <ol className="mt-5 list-decimal space-y-2 pl-6 text-lg text-mist" {...props} />,
  a: (props) => <a className="font-semibold text-lime underline underline-offset-4 hover:text-white" {...props} />,
  blockquote: (props) => (
    <blockquote className="mt-6 border-l-4 border-lime pl-5 text-lg italic text-snow" {...props} />
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
