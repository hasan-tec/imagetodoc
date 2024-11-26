import React, { useState } from 'react';
import { FileUploader } from './components/FileUploader';
import { DocumentEditor } from './components/DocumentEditor';
import { Loader } from './components/Loader';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Toaster, toast } from 'react-hot-toast';
import { FileText, Upload } from 'lucide-react';

const genAI = new GoogleGenerativeAI('AIzaSyDZ6o76hZD-ikcZYqqfRN06IAqI9n3iRv0');

function App() {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const processImages = async (files: File[]) => {
    try {
      setLoading(true);
      
      const MAX_FILE_SIZE = 4 * 1024 * 1024;
      const validFiles = files.filter(file => file.size <= MAX_FILE_SIZE);

      if (validFiles.length === 0) {
        throw new Error('No valid files to process');
      }

      const extractTextPromises = validFiles.map(async (file) => {
        const reader = new FileReader();
        const base64Promise = new Promise((resolve) => {
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
        
        const base64Data = await base64Promise;
        const base64String = (base64Data as string).split(',')[1];

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const result = await model.generateContent([
          {
            inlineData: {
              data: base64String,
              mimeType: file.type
            }
          },
          `Extract and format the text from this image, adhering to the following guidelines:

1. Headings:
   - Use '#' for h1, '##' for h2, and so on
   - Ensure a single newline before and after each heading
   - Do not use asterisks for headings

2. Paragraphs:
   - Maintain paragraph structure
   - Separate paragraphs with a single blank line

3. Lists:
   - Use '-' for unordered lists
   - Use '1.', '2.', etc. for numbered lists
   - Use 'a.', 'b.', etc. for alphabetical lists
   - Use 'i.', 'ii.', 'iii.', etc. for Roman numeral lists
   - Ensure each list item starts on a new line
   - Only use list formatting when the original content clearly shows a list
   - Ensure proper indentation for nested lists (use 2 spaces)

4. Roman Numerals:
   - When Roman numerals are used for sections or subsections, ensure they are on their own line
   - Format as 'i.', 'ii.', 'iii.', etc., followed by a space and the content

5. Text Styling:
   - Use single '*' for italic and double '**' for bold text
   - Do not use excessive asterisks

6. General Formatting:
   - Preserve the original structure of the document
   - Ensure proper spacing and indentation throughout the document
   - Use a single newline to separate different elements (e.g., between a heading and a paragraph)

Please structure the response in clean, well-formatted Markdown, closely matching the original document's layout and structure.`
        ]);

        const response = await result.response;
        return response.text();
      });

      const extractedTexts = await Promise.all(extractTextPromises);
      const combinedText = extractedTexts.join('\n\n---\n\n');
      
      setContent(combinedText);
      toast.success('Text extracted successfully from all valid images!');
    } catch (error) {
      console.error('Error processing images:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Smart Document Editor</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <Loader />
        ) : !content ? (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="max-w-xl mx-auto">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-blue-600" />
                <h2 className="mt-4 text-xl font-semibold text-gray-900">Upload images</h2>
                <p className="mt-2 text-sm text-gray-600">
                  Upload one or more images containing text to extract and edit (max 4MB each)
                </p>
              </div>
              <FileUploader onFilesSelect={processImages} />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg">
            <DocumentEditor initialContent={content} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

