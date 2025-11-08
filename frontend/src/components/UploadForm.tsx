'use client';

interface UploadFormProps {
  onFileUpload: (file: File) => Promise<void>;
}

export default function UploadForm({ onFileUpload }: UploadFormProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement;
    
    if (fileInput.files && fileInput.files[0]) {
      await onFileUpload(fileInput.files[0]);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Upload Receipt (PDF)
          </label>
          <input
            type="file"
            accept=".pdf"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          Upload and Analyze
        </button>
      </form>
    </div>
  );
}