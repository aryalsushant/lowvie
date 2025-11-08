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
      className={`file-drop-zone p-8 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all
        ${isDragActive
          ? 'border-primary bg-primary/10'
          : 'border-gray-600 hover:border-primary/50 hover:bg-white/5'
        }`}
    >
      <input {...getInputProps()} />
      <div className="space-y-4">
        <p className="text-lg font-medium">
          {isDragActive
            ? 'Drop your receipt here'
            : 'Drag & drop your receipt here'}
        </p>
        <p className="text-sm text-text-secondary">
          or click to browse files
        </p>
        <div className="text-xs text-text-secondary">
          Supported formats: PDF, PNG, JPG
        </div>
      </div>
    </div>
  );
}