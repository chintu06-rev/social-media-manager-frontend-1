import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Plus } from 'lucide-react';
import { api } from '../services/api';

export default function ConnectModal({ isOpen, onClose, onAccountConnected, currentUser }) {
  if (!isOpen) return null;

  const [platform, setPlatform] = useState('INSTAGRAM');
  const [accountName, setAccountName] = useState('');
  const [handle, setHandle] = useState('');
  const [externalAccountId, setExternalAccountId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const platformDefaults = {
    INSTAGRAM: {
      accountName: 'UrbanVibe Studios',
      handle: '@urbanvibe_official',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      externalId: '178414009988776'
    },
    FACEBOOK: {
      accountName: 'UrbanVibe Facebook Page',
      handle: '@urbanvibe.fb',
      avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150',
      externalId: '109823482718'
    },
    LINKEDIN: {
      accountName: 'UrbanVibe Media Inc.',
      handle: '@urbanvibe-media',
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
      externalId: 'urn:li:organization:445566'
    },
    TWITTER: {
      accountName: 'UrbanVibe HQ',
      handle: '@UrbanVibeHQ',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      externalId: '99001122'
    }
  };

  const handleSelectPlatform = (p) => {
    setPlatform(p);
    const defaults = platformDefaults[p];
    if (defaults) {
      setAccountName(defaults.accountName);
      setHandle(defaults.handle);
      setExternalAccountId(defaults.externalId);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const defaults = platformDefaults[platform];
    const finalName = accountName.trim() || defaults.accountName;
    const finalHandle = handle.trim() || defaults.handle;

    try {
      setLoading(true);
      const newAccount = await api.connectAccount({
        platform,
        accountName: finalName,
        handle: finalHandle.startsWith('@') ? finalHandle : `@${finalHandle}`,
        avatarUrl: defaults.avatarUrl,
        accessToken: accessToken.trim() || 'oauth_token_' + System_time(),
        externalAccountId: externalAccountId.trim() || defaults.externalId,
        userId: currentUser?.id || null
      });

      if (onAccountConnected) onAccountConnected(newAccount);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to connect account.');
    } finally {
      setLoading(false);
    }
  };

  function System_time() {
    return Math.floor(Date.now() / 1000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-base font-bold text-white">Connect Social Account</h2>
        </div>
        <p className="text-xs text-slate-400 mb-5">
          Link a new account to enable unified broadcasting from your dashboard.
        </p>

        {/* Platform Selection */}
        <div className="grid grid-cols-4 gap-2 mb-5">
          {['INSTAGRAM', 'FACEBOOK', 'LINKEDIN', 'TWITTER'].map(p => (
            <button
              type="button"
              key={p}
              onClick={() => handleSelectPlatform(p)}
              className={`py-2 px-1 text-center rounded-xl border text-xs font-semibold transition-all ${
                platform === p
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {p === 'TWITTER' ? 'X / Twitter' : p[0] + p.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Account / Page Name</label>
            <input
              type="text"
              value={accountName}
              placeholder={platformDefaults[platform]?.accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Social Handle</label>
            <input
              type="text"
              value={handle}
              placeholder={platformDefaults[platform]?.handle}
              onChange={(e) => setHandle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              External Page ID / IG User ID
            </label>
            <input
              type="text"
              value={externalAccountId}
              placeholder={platformDefaults[platform]?.externalId}
              onChange={(e) => setExternalAccountId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              OAuth Token <span className="text-slate-500">(Optional in simulation mode)</span>
            </label>
            <input
              type="password"
              value={accessToken}
              placeholder="Auto-generated simulation token if empty"
              onChange={(e) => setAccessToken(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="flex items-center gap-2 p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-xl text-xs">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Tokens are securely stored and used exclusively for automated dispatching.</span>
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 p-2.5 rounded-xl">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-700 text-xs font-medium text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 disabled:opacity-50"
            >
              {loading ? 'Connecting...' : 'Connect Channel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
