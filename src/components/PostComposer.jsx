import React, { useState } from 'react';
import { Send, Calendar, Image as ImageIcon, X, AlertCircle, CheckCircle2, Hash, Sparkles, ArrowRight } from 'lucide-react';
import LiveSocialPreview from './LiveSocialPreview';
import { api } from '../services/api';

export default function PostComposer({ accounts, currentUser, onPostCreated, onOpenConnectModal }) {
  const [caption, setCaption] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [selectedAccounts, setSelectedAccounts] = useState(() => accounts.map(a => a.id));

  // Sync selectedAccounts when accounts list updates
  React.useEffect(() => {
    setSelectedAccounts(accounts.map(a => a.id));
  }, [accounts]);

  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [uploading, setUploading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Platform badges metadata
  const platformMeta = {
    FACEBOOK: { label: 'Facebook', bg: 'bg-blue-600', text: 'text-blue-400', border: 'border-blue-500/30', maxChars: 63206 },
    INSTAGRAM: { label: 'Instagram', bg: 'bg-gradient-to-tr from-pink-500 to-purple-600', text: 'text-pink-400', border: 'border-pink-500/30', maxChars: 2200 },
    TWITTER: { label: 'X / Twitter', bg: 'bg-slate-700', text: 'text-slate-300', border: 'border-slate-500/30', maxChars: 280 },
    LINKEDIN: { label: 'LinkedIn', bg: 'bg-blue-700', text: 'text-blue-400', border: 'border-blue-600/30', maxChars: 3000 },
  };

  const toggleAccount = (id) => {
    setSelectedAccounts(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelectedAccounts(accounts.map(a => a.id));
  const deselectAll = () => setSelectedAccounts([]);

  // Handle local file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      setErrorMsg('');
      const res = await api.uploadMedia(file);
      setMediaUrl(res.url);
    } catch (err) {
      setErrorMsg('Failed to upload image: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  // Add sample hashtags
  const addHashtag = (tag) => {
    setCaption(prev => prev ? `${prev} ${tag}` : tag);
  };

  // Validation checks
  const isInstagramSelected = accounts.some(a => selectedAccounts.includes(a.id) && a.platform === 'INSTAGRAM');
  const isTwitterSelected = accounts.some(a => selectedAccounts.includes(a.id) && a.platform === 'TWITTER');
  const twitterExceeded = isTwitterSelected && caption.length > 280;
  const instagramMissingImage = isInstagramSelected && !mediaUrl;

  const handlePublish = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (selectedAccounts.length === 0) {
      setErrorMsg('Please select at least one social media account.');
      return;
    }

    if (!caption.trim()) {
      setErrorMsg('Please write a caption or message before publishing.');
      return;
    }

    if (instagramMissingImage) {
      setErrorMsg('Instagram requires an image or video attachment to publish.');
      return;
    }

    if (twitterExceeded) {
      setErrorMsg(`Twitter character limit exceeded (${caption.length}/280). Shorten your caption or deselect Twitter.`);
      return;
    }

    try {
      setPublishing(true);
      const payload = {
        caption: caption.trim(),
        mediaUrl: mediaUrl || null,
        mediaType: mediaUrl ? 'IMAGE' : 'NONE',
        targetAccountIds: selectedAccounts,
        scheduledAt: isScheduled && scheduledDate ? scheduledDate : null,
        publishImmediately: !isScheduled,
        userId: currentUser?.id || null
      };

      const result = await api.createPost(payload);
      setSuccessMsg(
        isScheduled
          ? 'Post successfully scheduled!'
          : `Published across ${selectedAccounts.length} selected social channel(s)!`
      );

      // Reset form
      setCaption('');
      setMediaUrl('');
      setIsScheduled(false);
      setScheduledDate('');

      if (onPostCreated) {
        onPostCreated(result);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to dispatch post.');
    } finally {
      setPublishing(false);
    }
  };

  if (accounts.length === 0) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-2xl my-8">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4 shadow-inner">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Connect Your Social Accounts</h2>
        <p className="text-xs text-slate-400 mb-6 max-w-md mx-auto leading-relaxed">
          To broadcast posts with a single click, link your Instagram, Facebook, LinkedIn, or Twitter account to your dashboard.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center gap-1.5">
            <span className="text-xl">📸</span>
            <span className="text-xs font-semibold text-slate-200">Instagram</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center gap-1.5">
            <span className="text-xl">📘</span>
            <span className="text-xs font-semibold text-slate-200">Facebook</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center gap-1.5">
            <span className="text-xl">💼</span>
            <span className="text-xs font-semibold text-slate-200">LinkedIn</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center gap-1.5">
            <span className="text-xl">🐦</span>
            <span className="text-xs font-semibold text-slate-200">X / Twitter</span>
          </div>
        </div>

        <button
          onClick={onOpenConnectModal}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all inline-flex items-center gap-2"
        >
          <span>Connect Your First Social Account</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Post Composer Form */}
      <div className="lg:col-span-7 space-y-5">
        {/* Step 1: Select Target Channels */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">1</span>
                Select Platforms to Publish
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Click to toggle which accounts will receive this post</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <button onClick={selectAll} className="text-indigo-400 hover:text-indigo-300 font-medium">Select All</button>
              <span className="text-slate-600">•</span>
              <button onClick={deselectAll} className="text-slate-400 hover:text-slate-300">Clear</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {accounts.map(acc => {
              const isSelected = selectedAccounts.includes(acc.id);
              const meta = platformMeta[acc.platform] || { label: acc.platform, bg: 'bg-slate-700', text: 'text-slate-400', border: 'border-slate-700' };

              return (
                <div
                  key={acc.id}
                  onClick={() => toggleAccount(acc.id)}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-indigo-500/80 shadow-md shadow-indigo-500/10'
                      : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 opacity-60'
                  }`}
                >
                  <div className="relative">
                    <img src={acc.avatarUrl} alt={acc.accountName} className="w-9 h-9 rounded-full object-cover" />
                    <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${meta.bg} text-white flex items-center justify-center text-[9px] font-bold ring-2 ring-slate-900`}>
                      {acc.platform[0]}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-100 truncate">{acc.accountName}</span>
                      {isSelected ? (
                        <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0"></div>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <span>{acc.handle}</span>
                      <span className="text-slate-600">•</span>
                      <span className={`${meta.text} font-medium`}>{meta.label}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2: Compose Message */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">2</span>
              Compose Content
            </h2>
            <div className="flex items-center gap-3 text-xs">
              {isTwitterSelected && (
                <span className={`font-mono px-2 py-0.5 rounded ${
                  caption.length > 280 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-slate-800 text-slate-400'
                }`}>
                  X: {caption.length}/280
                </span>
              )}
              <span className="text-slate-500">{caption.length} chars</span>
            </div>
          </div>

          {/* Text Area */}
          <div className="relative">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What would you like to broadcast to your social channels? Include hashtags, links, or updates..."
              rows={5}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-slate-100 text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          {/* Quick Hashtag Chips */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-500 flex items-center gap-1"><Hash className="w-3 h-3" /> Quick Tags:</span>
            {['#SocialSync', '#Trending', '#Productivity', '#TechNews', '#Marketing', '#Growth'].map(tag => (
              <button
                key={tag}
                onClick={() => addHashtag(tag)}
                className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Media Attachment Section */}
          <div className="pt-2 border-t border-slate-800">
            <label className="block text-xs font-medium text-slate-300 mb-2">
              Media Attachment (Required for Instagram)
            </label>

            {mediaUrl ? (
              <div className="relative group w-full sm:w-64 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                <img src={mediaUrl} alt="Preview" className="w-full h-36 object-cover" />
                <button
                  onClick={() => setMediaUrl('')}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600/90 text-white hover:bg-red-700 shadow-lg"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <label className="flex-1 flex flex-col items-center justify-center p-4 border border-dashed border-slate-700 hover:border-indigo-500/80 rounded-xl cursor-pointer bg-slate-950/40 hover:bg-slate-950 transition-all text-center">
                  <ImageIcon className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-xs font-medium text-slate-300">
                    {uploading ? 'Uploading media...' : 'Upload Image / Media'}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5">PNG, JPG, WebP up to 15MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>

                {/* Sample Preset Images for instant one-click testing */}
                <div className="flex sm:flex-col gap-2 justify-center">
                  <span className="text-[10px] text-slate-500">Preset Samples:</span>
                  <button
                    onClick={() => setMediaUrl('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800')}
                    className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-lg text-left truncate"
                  >
                    Tech Gradient
                  </button>
                  <button
                    onClick={() => setMediaUrl('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800')}
                    className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-lg text-left truncate"
                  >
                    Team Collab
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Step 3: Schedule or Publish Immediately */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">3</span>
              Publish Options
            </h2>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400 flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isScheduled}
                  onChange={(e) => setIsScheduled(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-0"
                />
                Schedule for later
              </label>
            </div>
          </div>

          {isScheduled && (
            <div className="flex items-center gap-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800">
              <Calendar className="w-5 h-5 text-indigo-400 shrink-0" />
              <input
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="bg-transparent text-sm text-slate-200 focus:outline-none w-full"
              />
            </div>
          )}

          {/* Validation Banner Alerts */}
          {instagramMissingImage && (
            <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-xl text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Instagram requires an image. Please attach an image above or uncheck Instagram.</span>
            </div>
          )}

          {twitterExceeded && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Twitter post exceeds 280 characters limit ({caption.length}/280).</span>
            </div>
          )}

          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handlePublish}
            disabled={publishing || selectedAccounts.length === 0}
            className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200"
          >
            {publishing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Broadcasting to {selectedAccounts.length} platform(s)...</span>
              </>
            ) : isScheduled ? (
              <>
                <Calendar className="w-4 h-4" />
                <span>Schedule Post</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Publish Once to Selected Platforms ({selectedAccounts.length})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Column: Live Multi-Platform Social Preview */}
      <div className="lg:col-span-5">
        <LiveSocialPreview
          caption={caption}
          mediaUrl={mediaUrl}
          selectedAccounts={selectedAccounts}
          accounts={accounts}
        />
      </div>
    </div>
  );
}
