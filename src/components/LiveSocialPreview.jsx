import React, { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, ThumbsUp, MessageSquare, Repeat2, Eye, Share2 } from 'lucide-react';

export default function LiveSocialPreview({ caption, mediaUrl, selectedAccounts, accounts }) {
  const [previewPlatform, setPreviewPlatform] = useState('INSTAGRAM');

  // Filter accounts belonging to selected preview platform or fallback to first
  const activeAccount = accounts.find(a => a.platform === previewPlatform && selectedAccounts.includes(a.id))
    || accounts.find(a => a.platform === previewPlatform)
    || {
      accountName: 'Your Brand Account',
      handle: '@yourbrand',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
    };

  const platforms = [
    { id: 'INSTAGRAM', name: 'Instagram', color: 'from-pink-500 via-purple-500 to-amber-500' },
    { id: 'FACEBOOK', name: 'Facebook', color: 'bg-blue-600' },
    { id: 'TWITTER', name: 'X / Twitter', color: 'bg-slate-800' },
    { id: 'LINKEDIN', name: 'LinkedIn', color: 'bg-blue-700' }
  ];

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col h-full">
      {/* Header & Platform Toggle */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Live Multi-Platform Preview</h3>
          <p className="text-xs text-slate-500">Real-time render of your post</p>
        </div>

        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
          {platforms.map(p => (
            <button
              key={p.id}
              onClick={() => setPreviewPlatform(p.id)}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                previewPlatform === p.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Preview Card Canvas */}
      <div className="flex-1 flex items-center justify-center p-4 bg-slate-950/70 rounded-xl my-4 border border-slate-800/60 overflow-y-auto max-h-[520px]">
        {/* INSTAGRAM PREVIEW */}
        {previewPlatform === 'INSTAGRAM' && (
          <div className="w-full max-w-[340px] bg-black text-white rounded-xl border border-slate-800 overflow-hidden shadow-2xl text-xs">
            {/* Instagram Header */}
            <div className="flex items-center justify-between p-3 border-b border-slate-900">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600">
                  <img src={activeAccount.avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover border border-black" />
                </div>
                <div>
                  <div className="font-semibold text-xs leading-none">{activeAccount.handle.replace('@', '')}</div>
                  <span className="text-[10px] text-slate-400">Sponsored • Just now</span>
                </div>
              </div>
              <span className="text-slate-400 font-bold">•••</span>
            </div>

            {/* Media Image */}
            <div className="w-full aspect-square bg-slate-900 flex items-center justify-center overflow-hidden">
              {mediaUrl ? (
                <img src={mediaUrl} alt="Post Media" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-6 text-slate-500">
                  <div className="w-12 h-12 rounded-full bg-slate-800 mx-auto flex items-center justify-center mb-2">📸</div>
                  <p className="text-xs">No image attached.<br/>Instagram requires an image or video.</p>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3 text-slate-200">
                  <Heart className="w-5 h-5 hover:text-red-500 cursor-pointer" />
                  <MessageCircle className="w-5 h-5 cursor-pointer" />
                  <Send className="w-5 h-5 cursor-pointer" />
                </div>
                <Bookmark className="w-5 h-5 cursor-pointer" />
              </div>

              <div className="font-semibold text-xs mb-1">1,248 likes</div>
              <div className="text-xs text-slate-200 leading-relaxed">
                <span className="font-semibold mr-1.5">{activeAccount.handle.replace('@', '')}</span>
                <span className="whitespace-pre-line">{caption || 'Write your caption...'}</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-2 uppercase tracking-wide">2 minutes ago</div>
            </div>
          </div>
        )}

        {/* FACEBOOK PREVIEW */}
        {previewPlatform === 'FACEBOOK' && (
          <div className="w-full max-w-[360px] bg-slate-900 text-slate-200 rounded-xl border border-slate-800 overflow-hidden shadow-2xl text-xs">
            {/* Header */}
            <div className="p-3.5 pb-2">
              <div className="flex items-center gap-2.5 mb-2.5">
                <img src={activeAccount.avatarUrl} alt="Avatar" className="w-9 h-9 rounded-full object-cover border border-blue-500" />
                <div>
                  <div className="font-semibold text-xs text-white flex items-center gap-1">
                    {activeAccount.accountName}
                    <span className="w-3 h-3 bg-blue-500 text-white rounded-full flex items-center justify-center text-[8px]">✓</span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <span>Just now</span> • <span>🌐</span>
                  </div>
                </div>
              </div>

              {/* Caption */}
              <p className="text-xs leading-relaxed whitespace-pre-line mb-3">
                {caption || 'What\'s on your mind?'}
              </p>
            </div>

            {/* Media */}
            {mediaUrl && (
              <div className="w-full max-h-64 bg-black overflow-hidden flex items-center justify-center">
                <img src={mediaUrl} alt="Facebook attachment" className="w-full object-cover" />
              </div>
            )}

            {/* Reactions / Stats */}
            <div className="px-3 py-2 flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800">
              <div className="flex items-center gap-1">
                <span className="text-xs">👍❤️</span> <span>84</span>
              </div>
              <div>12 comments • 4 shares</div>
            </div>

            {/* Action Bar */}
            <div className="grid grid-cols-3 py-1 text-slate-400 font-medium text-xs">
              <button className="flex items-center justify-center gap-1.5 py-1.5 hover:bg-slate-800 rounded">
                <ThumbsUp className="w-3.5 h-3.5" /> Like
              </button>
              <button className="flex items-center justify-center gap-1.5 py-1.5 hover:bg-slate-800 rounded">
                <MessageSquare className="w-3.5 h-3.5" /> Comment
              </button>
              <button className="flex items-center justify-center gap-1.5 py-1.5 hover:bg-slate-800 rounded">
                <Share2 className="w-3.5 h-3.5" /> Share
              </button>
            </div>
          </div>
        )}

        {/* TWITTER / X PREVIEW */}
        {previewPlatform === 'TWITTER' && (
          <div className="w-full max-w-[360px] bg-black text-white rounded-xl border border-slate-800 p-3.5 shadow-2xl text-xs">
            <div className="flex gap-3">
              <img src={activeAccount.avatarUrl} alt="Avatar" className="w-9 h-9 rounded-full object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-1">
                  <span className="font-bold text-white truncate">{activeAccount.accountName}</span>
                  <span className="text-blue-400 text-xs">✓</span>
                  <span className="text-slate-500 truncate">{activeAccount.handle}</span>
                  <span className="text-slate-600">· 1m</span>
                </div>

                <p className="text-xs leading-relaxed whitespace-pre-line text-slate-100 mb-2.5">
                  {caption || 'What is happening?!'}
                </p>

                {mediaUrl && (
                  <div className="rounded-xl overflow-hidden border border-slate-800 mb-2.5 max-h-52">
                    <img src={mediaUrl} alt="Tweet media" className="w-full object-cover" />
                  </div>
                )}

                {/* Twitter Actions */}
                <div className="flex items-center justify-between text-slate-500 text-xs pt-1">
                  <span className="flex items-center gap-1.5 hover:text-blue-400 cursor-pointer">
                    <MessageCircle className="w-3.5 h-3.5" /> 24
                  </span>
                  <span className="flex items-center gap-1.5 hover:text-green-400 cursor-pointer">
                    <Repeat2 className="w-3.5 h-3.5" /> 8
                  </span>
                  <span className="flex items-center gap-1.5 hover:text-pink-400 cursor-pointer">
                    <Heart className="w-3.5 h-3.5" /> 142
                  </span>
                  <span className="flex items-center gap-1.5 hover:text-blue-400 cursor-pointer">
                    <Eye className="w-3.5 h-3.5" /> 3.2K
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LINKEDIN PREVIEW */}
        {previewPlatform === 'LINKEDIN' && (
          <div className="w-full max-w-[360px] bg-slate-900 text-slate-200 rounded-xl border border-slate-800 overflow-hidden shadow-2xl text-xs">
            <div className="p-3.5 pb-2">
              <div className="flex items-center gap-2.5 mb-2.5">
                <img src={activeAccount.avatarUrl} alt="Avatar" className="w-9 h-9 rounded object-cover" />
                <div>
                  <div className="font-semibold text-white">{activeAccount.accountName}</div>
                  <div className="text-[10px] text-slate-400">12,400 followers • 1h</div>
                </div>
              </div>

              <p className="text-xs leading-relaxed whitespace-pre-line mb-3">
                {caption || 'Share an update or perspective...'}
              </p>
            </div>

            {mediaUrl && (
              <div className="w-full max-h-60 bg-black overflow-hidden flex items-center justify-center">
                <img src={mediaUrl} alt="LinkedIn media" className="w-full object-cover" />
              </div>
            )}

            <div className="px-3 py-1.5 text-[10px] text-slate-400 border-b border-slate-800">
              👏💡 142 reactions • 19 comments
            </div>

            <div className="grid grid-cols-4 py-1 text-slate-400 text-xs text-center font-medium">
              <span className="py-1 hover:bg-slate-800 rounded cursor-pointer">Like</span>
              <span className="py-1 hover:bg-slate-800 rounded cursor-pointer">Comment</span>
              <span className="py-1 hover:bg-slate-800 rounded cursor-pointer">Repost</span>
              <span className="py-1 hover:bg-slate-800 rounded cursor-pointer">Send</span>
            </div>
          </div>
        )}
      </div>

      <div className="text-center text-[11px] text-slate-500">
        💡 Preview adapts instantly as you type and attach media
      </div>
    </div>
  );
}
