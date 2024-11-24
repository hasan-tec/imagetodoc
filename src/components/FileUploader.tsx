import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface FileUploaderProps {
  onFilesSelect: (files: File[]) => void;
}

export function FileUploader({ onFilesSelect }: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFilesSelect(acceptedFiles);
    }
  }, [onFilesSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp']
    },
    multiple: true,
    maxSize: 4 * 1024 * 1024, // 4MB
    onDropRejected: () => {
      toast.error('One or more files are too large or in an invalid format. Please use images under 4MB.');
    }
  });

  return (
    <div
      {...getRootProps()}
      className={`mt-6 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      {isDragActive ? (
        <p className="mt-2 text-sm text-gray-600">Drop the images here...</p>
      ) : (
        <div>
          <p className="mt-2 text-sm text-gray-600">
            Drag and drop images here, or click to select
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Supports PNG, JPG, JPEG, GIF, BMP (max 4MB each)
          </p>
        </div>
      )}
    </div>
  );
}

