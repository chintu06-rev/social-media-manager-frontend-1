import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, ShieldCheck, ExternalLink, HelpCircle } from 'lucide-react';
import { api } from '../services/api';
import ConnectModal from './ConnectModal';

export default function AccountsManager({ accounts, currentUser, onAccountConnected, onAccountDisconnected }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [disconnectingId, setDisconnectingId] = useState(null);

  const handleDisconnect = async (id) => {
    if (!confirm('Are you sure you want to disconnect this account?')) return;
    try {
      setDisconnectingId(id);
      await api.disconnectAccount(id);
      if (onAccountDisconnected) onAccountDisconnected(id);
    } catch (err) {
      alert('Failed to disconnect: ' + err.message);
    } finally {
      setDisconnectingId(null);
    }
  };

  const platformConfig = {
    INSTAGRAM: {
      name: 'Instagram Business',
      color: 'bg-gradient-to-tr from-pink-500 to-purple-600',
      badge: 'Meta Graph API',
      note: 'Requires Instagram Business/Creator connected to a Facebook Page.'
    },
    FACEBOOK: {
      name: 'Facebook Page',
      color: 'bg-blue-600',
      badge: 'Pages API',
      note: 'Publishes directly to the Page timeline feed.'
    },
    LINKEDIN: {
      name: 'LinkedIn Company',
      color: 'bg-blue-700',
      badge: 'UGC Post API',
      note: 'Publishes organizational updates.'
    },
    TWITTER: {
      name: 'X / Twitter',
      color: 'bg-slate-700',
      badge: 'v2 Tweets API',
      note: 'Free tier 280-character microblogging.'
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            Connected Social Accounts
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
              {accounts.length} Active
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage authorized OAuth tokens and API access for each social channel.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Connect New Account
        </button>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map(acc => {
          const config = platformConfig[acc.platform] || {
            name: acc.platform,
            color: 'bg-slate-700',
            badge: 'Standard API',
            note: ''
          };

          return (
            <div
              key={acc.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={acc.avatarUrl}
                        alt={acc.accountName}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-800"
                      />
                      <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${config.color} text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-slate-900`}>
                        {acc.platform[0]}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-white">{acc.accountName}</h3>
                      <div className="text-xs text-slate-400">{acc.handle}</div>
                      <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        {config.badge}
                      </span>
                    </div>
                  </div>

                  <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" /> Connected
                  </span>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 space-y-1.5 text-xs mb-4">
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>External ID:</span>
                    <span className="font-mono text-slate-300">{acc.externalAccountId || 'Default'}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Connected on:</span>
                    <span className="text-slate-300">{new Date(acc.connectedAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                    {config.note}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => handleDisconnect(acc.id)}
                  disabled={disconnectingId === acc.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{disconnectingId === acc.id ? 'Disconnecting...' : 'Disconnect'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Meta API Guide Card */}
      <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2 font-semibold text-indigo-300 text-sm">
          <HelpCircle className="w-4 h-4 text-indigo-400" />
          Real Meta (Facebook & Instagram) API Setup Notes
        </div>
        <p>
          By default, this application runs in <strong>Simulation Mode</strong> (<code className="text-indigo-200">app.social.simulation-mode=true</code>), allowing you to test end-to-end multi-platform publishing immediately without awaiting Facebook App Review.
        </p>
        <p>
          To connect live Meta production tokens:
        </p>
        <ol className="list-decimal list-inside space-y-1 text-slate-400 pl-1">
          <li>Create an App at <span className="text-indigo-300 font-mono">developers.facebook.com</span></li>
          <li>Add <strong>Instagram Graph API</strong> and <strong>Facebook Pages API</strong> products.</li>
          <li>Grant permissions: <span className="text-slate-200 font-mono text-[11px]">pages_manage_posts, pages_read_engagement, instagram_basic, instagram_content_publish</span>.</li>
          <li>Set <span className="text-indigo-200 font-mono text-[11px]">app.social.simulation-mode=false</span> in <span className="text-slate-200 font-mono text-[11px]">application.properties</span>.</li>
        </ol>
      </div>

      {/* Connect Modal */}
      <ConnectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAccountConnected={onAccountConnected}
        currentUser={currentUser}
      />
    </div>
  );
}
