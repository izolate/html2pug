import { minify } from 'html-minifier';
import { DefaultTreeDocument, parse, parseFragment } from 'parse5';
import { defaultOptions, Options } from './Options';
import Pugify from './Parser';

export default (sourceHtml: string, options?: Options) => {
  const opts: Options = options
    ? { ...defaultOptions, ...options }
    : defaultOptions;

  // Minify source HTML
  const html: string = minify(sourceHtml, opts);

  const {
    fragment,
    tabs,
    commas,
    doubleQuotes,
  }: {
    fragment: boolean;
    tabs: boolean;
    commas: boolean;
    doubleQuotes: boolean;
  } = opts;

  // Parse HTML and convert to Pug
  const doc = fragment ? parseFragment(html) : parse(html);
  const pugify = new Pugify(doc as DefaultTreeDocument, opts);
  return pugify.parse();
};
