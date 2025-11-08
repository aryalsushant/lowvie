import { useState } from 'react';

interface KnotConnectProps {
  onSuccess: () => void;
}

export default function KnotConnect({ onSuccess }: KnotConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // Simulating a successful connection since we're just mocking the functionality
      setTimeout(() => {
        onSuccess();
        setIsConnecting(false);
      }, 1500);
    } catch (error) {
      console.error('Error connecting account:', error);
      setIsConnecting(false);
    }
  };

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0070BA] px-5 text-white transition-colors hover:bg-[#003087] disabled:opacity-50 md:w-[158px]"
    >
      {isConnecting ? (
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : (
        <>
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
            <path
              d="M20.5 12H3.5M3.5 12L9.5 18M3.5 12L9.5 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Connect PayPal
        </>
      )}
    </button>
  );
}