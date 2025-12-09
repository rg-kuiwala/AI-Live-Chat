import React, { useState, useRef, useEffect } from 'react';
import { ConnectionState } from './types';
import { LiveClient } from './services/liveClient';
import Visualizer from './components/Visualizer';
import AdOverlay from './components/AdOverlay';
import { Mic, MicOff, Phone, PhoneOff } from 'lucide-react';

const App: React.FC = () => {
  const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.DISCONNECTED);
  const [volume, setVolume] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showAd, setShowAd] = useState(false);
  const liveClientRef = useRef<LiveClient | null>(null);

  useEffect(() => {
    return () => {
      liveClientRef.current?.disconnect();
    };
  }, []);

  const connectToGemini = async () => {
    try {
      setConnectionState(ConnectionState.CONNECTING);
      setErrorMsg(null);
      
      const client = new LiveClient();
      liveClientRef.current = client;

      client.onVolumeChange = setVolume;
      client.onDisconnect = () => {
        setConnectionState(ConnectionState.DISCONNECTED);
        setVolume(0);
        liveClientRef.current = null;
      };

      await client.connect();
      setConnectionState(ConnectionState.CONNECTED);

    } catch (err) {
      console.error(err);
      setConnectionState(ConnectionState.ERROR);
      setErrorMsg("Connection failed. Check your API Key or permissions.");
      liveClientRef.current = null;
    }
  };

  const handleStartCall = () => setShowAd(true);
  const handleAdClose = () => {
    setShowAd(false);
    connectToGemini();
  };
  const handleDisconnect = () => liveClientRef.current?.disconnect();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center relative overflow-hidden selection:bg-indigo-500/30">
      {showAd && <AdOverlay onClose={handleAdClose} />}
      
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px] mix-blend-screen animate-blob" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-2000" />
      </div>

      {/* Header */}
      <header className="z-10 w-full p-6 flex justify-between items-center opacity-70">
        <span className="text-sm font-semibold tracking-wider text-indigo-400 uppercase">AI Friend</span>
        <div className={`h-2 w-2 rounded-full ${
          connectionState === ConnectionState.CONNECTED ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-slate-700'
        }`} />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center w-full z-10 px-4">
        
        <Visualizer 
          isActive={connectionState === ConnectionState.CONNECTED} 
          volume={volume} 
        />
        
        <div className="mt-8 h-8 text-center">
          {connectionState === ConnectionState.CONNECTING && (
            <p className="text-slate-400 animate-pulse font-light">Establishing connection...</p>
          )}
          {connectionState === ConnectionState.ERROR && (
            <p className="text-red-400 text-sm font-medium px-4 py-2 bg-red-950/30 rounded-lg border border-red-900/50">{errorMsg}</p>
          )}
          {connectionState === ConnectionState.CONNECTED && (
             <p className="text-indigo-300/80 text-sm font-light tracking-wide">Listening</p>
          )}
        </div>
      </main>

      {/* Controls */}
      <footer className="z-10 w-full pb-12 pt-4 px-6 flex justify-center">
        {connectionState === ConnectionState.DISCONNECTED || connectionState === ConnectionState.ERROR ? (
          <button
            onClick={handleStartCall}
            className="group relative flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 hover:bg-white text-slate-900 shadow-2xl shadow-indigo-500/20 transition-all transform hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-white" />
            <Phone size={32} strokeWidth={2.5} />
          </button>
        ) : (
          <button
            onClick={handleDisconnect}
            className="group flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 backdrop-blur-sm transition-all transform hover:scale-105 active:scale-95"
          >
            <PhoneOff size={32} strokeWidth={2.5} />
          </button>
        )}
      </footer>
    </div>
  );
};

export default App;