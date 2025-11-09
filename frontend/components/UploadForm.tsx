import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface UploadFormProps {
  onFileUpload: (file: File) => void;
}

export default function UploadForm({ onFileUpload }: UploadFormProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`group relative overflow-hidden p-12 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all duration-300 ease-in-out
        ${isDragActive
          ? 'border-blue-500 bg-blue-50/10 scale-[0.99]'
          : 'border-gray-400 hover:border-blue-400 hover:bg-gray-50/5 hover:scale-[0.99]'
        }`}
    >
      <input {...getInputProps()} />
      <div className="relative z-10 space-y-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800/30 flex items-center justify-center group-hover:bg-blue-900/30 transition-colors duration-300">
          <svg 
            className={`w-8 h-8 ${isDragActive ? 'text-blue-400' : 'text-gray-400'} group-hover:text-blue-400 transition-colors duration-300`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <div>
          <p className="text-xl font-medium mb-2 text-gray-200 group-hover:text-blue-400 transition-colors duration-300">
            {isDragActive ? 'Drop your receipt here' : 'Drag & drop your receipt here'}
          </p>
          <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
            or click to browse files
          </p>
        </div>
        <div className="text-xs text-gray-500 bg-gray-800/30 py-2 px-4 rounded-full inline-block group-hover:bg-blue-900/30 group-hover:text-gray-400 transition-all duration-300">
          Supported formats: PDF, PNG, JPG
        </div>
      </div>
      <div className={`absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isDragActive ? 'opacity-100' : ''}`}></div>
    </div>
  );
}