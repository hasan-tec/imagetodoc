import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';

function cleanupMarkdown(content: string): string {
  return content
    // Convert <h1> tags to Markdown
    .replace(/<h1>(.*?)<\/h1>/g, '# $1\n\n')
    // Convert <p> tags with # to proper headings
    .replace(/<p>#(.*?)<\/p>/g, '# $1\n\n')
    // Convert <ul> and <li> tags to Markdown
    .replace(/<ul>\s*<li>/g, '- ')
    .replace(/<\/li>\s*<li>/g, '\n- ')
    .replace(/<\/li>\s*<\/ul>/g, '\n\n')
    // Convert remaining <p> tags to plain text
    .replace(/<p>(.*?)<\/p>/g, '$1\n\n')
    // Handle Roman numerals
    .replace(/([ivxlcdm]+)\.\s+/gi, '\n$&')
    // Remove any remaining HTML tags
    .replace(/<[^>]*>/g, '')
    // Ensure proper spacing for Roman numerals
    .replace(/^([ivxlcdm]+)\.\s*/gim, '\n$1. ')
    // Trim extra whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function formatContent(content: string): string {
  let formattedContent = cleanupMarkdown(content);

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

