import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';

export function formatContent(content: string): string {
  // Clean up common formatting issues
  let formattedContent = content
    // Ensure proper heading spacing
    .replace(/(?<!\n)#{1,6} /g, '\n$&')
    // Fix list formatting
    .replace(/(?<!\n)[*-] /g, '\n$&')
    .replace(/(?<!\n)\d+\. /g, '\n$&')
    // Ensure proper paragraph spacing
    .replace(/\n{3,}/g, '\n\n')
    // Fix table formatting
    .replace(/(?<!\n)\|/g, '\n|')
    // Clean up extra whitespace
    .trim();

  // Convert markdown to HTML
  const processedContent = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .processSync(formattedContent);

  return String(processedContent);
}

export const markdownPlugins = [
  remarkGfm,
];

