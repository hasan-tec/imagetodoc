import React, { useState } from 'react';
import { FileUploader } from './components/FileUploader';
import { DocumentEditor } from './components/DocumentEditor';
import { Loader } from './components/Loader';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Toaster, toast } from 'react-hot-toast';
import { FileText, Upload } from 'lucide-react';

const genAI = new GoogleGenerativeAI('AIzaSyD6FVqyNDXEQnbyfgUHGZk2vQFI0MgDoo4');

function App() {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const processImage = async (file: File) => {
    try {
      setLoading(true);
      
      const MAX_FILE_SIZE = 4 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        throw new Error('File size exceeds 4MB limit');
      }

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
        `Extract and format the text from this image maintaining the following:
         - Preserve all headings with proper hierarchy (h1, h2, etc.)
         - Maintain paragraph structure and spacing
         - Format lists (bullet points and numbered lists)
         - Preserve any tables with proper formatting
         - Keep text styling (bold, italic) where visible
         - Maintain any visible sections or content hierarchy
         Please structure the response in markdown format.`
      ]);

      const response = await result.response;
      const text = response.text();
      
      if (!text) {
        throw new Error('No text could be extracted from the image');
      }
      
      setContent(text);
      toast.success('Text extracted successfully!');
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process image. Please try again.');
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
                <h2 className="mt-4 text-xl font-semibold text-gray-900">Upload an image</h2>
                <p className="mt-2 text-sm text-gray-600">
                  Upload an image containing text to extract and edit (max 4MB)
                </p>
              </div>
              <FileUploader onFileSelect={processImage} />
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

