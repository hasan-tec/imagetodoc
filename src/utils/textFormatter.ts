import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

export function formatGeminiResponse(text: string): string {
  // Clean up common formatting issues
  return text
    // Ensure proper heading spacing
    .replace(/(?<!\n)#{1,6} /g, '\n$&')
    // Fix list formatting
    .replace(/(?<!\n)[*-] /g, '\n* ')
    .replace(/(?<!\n)\d+\. /g, '\n$&')
    // Ensure proper paragraph spacing
    .replace(/\n{3,}/g, '\n\n')
    // Fix table formatting
    .replace(/(?<!\n)\|/g, '\n|')
    // Clean up extra whitespace
    .trim();
}

export const markdownPlugins = [
  remarkGfm,
  rehypeRaw
];