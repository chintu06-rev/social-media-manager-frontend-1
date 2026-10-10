import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import DashboardOverview from './components/DashboardOverview';
import PostComposer from './components/PostComposer';
import PostHistory from './components/PostHistory';
import AccountsManager from './components/AccountsManager';
import ConnectModal from './components/ConnectModal';
import AuthView from './components/AuthView';
import { api } from './services/api';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('socialsync_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState('compose');
  const [accounts, setAccounts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  const loadData = async (userId) => {
    const uid = userId !== undefined ? userId : currentUser?.id;
    if (!uid) return;

    try {
      setLoading(true);
      setError(null);
      const [accs, pts, sts] = await Promise.all([
        api.getAccounts(uid).catch(() => []),
        api.getPosts(uid).catch(() => []),
        api.getStats(uid).catch(() => null)
      ]);
      setAccounts(accs);
      setPosts(pts);
      setStats(sts);
    } catch (err) {
      setError(err.message || 'Failed to connect to backend server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadData(currentUser.id);
    }
  }, [currentUser?.id]);

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('socialsync_user', JSON.stringify(userData));
    loadData(userData.id);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('socialsync_user');
    setAccounts([]);
    setPosts([]);
    setStats(null);
  };

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
    if (currentUser?.id) {
      api.getStats(currentUser.id).then(setStats).catch(() => {});
    }
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
    if (currentUser?.id) {
      api.getStats(currentUser.id).then(setStats).catch(() => {});
    }
  };

  const handleAccountConnected = (newAcc) => {
    setAccounts(prev => [...prev, newAcc]);
    if (currentUser?.id) {
      api.getStats(currentUser.id).then(setStats).catch(() => {});
    }
  };

  const handleAccountDisconnected = (accId) => {
    setAccounts(prev => prev.filter(a => a.id !== accId));
    if (currentUser?.id) {
      api.getStats(currentUser.id).then(setStats).catch(() => {});
    }
  };

  // If not logged in, show Auth View (Sign in / Register)
  if (!currentUser) {
    return <AuthView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100">
      {/* Navbar with Profile & Logout */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-3"></div>
            <p className="text-xs font-medium">Synchronizing your dashboard...</p>
          </div>
        ) : error ? (
          <div className="bg-red-950/30 border border-red-500/30 rounded-2xl p-6 text-center max-w-md mx-auto my-12">
            <h3 className="text-red-400 font-bold mb-1">Backend Connection Error</h3>
            <p className="text-xs text-slate-400 mb-4">{error}</p>
            <p className="text-xs text-slate-500 mb-4">Ensure Spring Boot backend is running on port 8080.</p>
            <button
              onClick={() => loadData(currentUser.id)}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          <div>
            {activeTab === 'compose' && (
              <PostComposer
                accounts={accounts}
                currentUser={currentUser}
                onPostCreated={handlePostCreated}
                onOpenConnectModal={() => setIsConnectModalOpen(true)}
              />
            )}

            {activeTab === 'dashboard' && (
              <DashboardOverview
                stats={stats}
                onRefresh={() => loadData(currentUser.id)}
                onComposeClick={() => setActiveTab('compose')}
              />
            )}

            {activeTab === 'history' && (
              <PostHistory
                posts={posts}
                onPostUpdated={handlePostUpdated}
              />
            )}

            {activeTab === 'accounts' && (
              <AccountsManager
                accounts={accounts}
                currentUser={currentUser}
                onAccountConnected={handleAccountConnected}
                onAccountDisconnected={handleAccountDisconnected}
              />
            )}
          </div>
        )}
      </main>

      {/* Quick Connect Modal (callable from anywhere) */}
      <ConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onAccountConnected={handleAccountConnected}
        currentUser={currentUser}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#06090f] py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 SocialSync • Logged in as <span className="text-indigo-400 font-medium">{currentUser.fullName}</span></p>
          <p className="text-[11px] text-slate-600">
            Unified Social Media Dispatcher • Spring Boot &amp; React
          </p>
        </div>
      </footer>
    </div>
  );
}
