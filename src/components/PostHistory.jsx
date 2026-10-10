import React, { useState } from 'react';
import { ExternalLink, RotateCcw, CheckCircle2, XCircle, Clock, Image as ImageIcon, Calendar } from 'lucide-react';
import { api } from '../services/api';

export default function PostHistory({ posts, onPostUpdated }) {
  const [retryingId, setRetryingId] = useState(null);
  const [filter, setFilter] = useState('ALL');

  const handleRetry = async (deliveryId) => {
    try {
      setRetryingId(deliveryId);
      const updatedPost = await api.retryDelivery(deliveryId);
      if (onPostUpdated) onPostUpdated(updatedPost);
    } catch (err) {
      alert('Retry failed: ' + err.message);
    } finally {
      setRetryingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PUBLISHED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Published
          </span>
        );
      case 'PARTIALLY_PUBLISHED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" /> Partial
          </span>
        );
      case 'SCHEDULED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Calendar className="w-3.5 h-3.5" /> Scheduled
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
            <XCircle className="w-3.5 h-3.5" /> Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400">
            {status}
          </span>
        );
    }
  };

  const filteredPosts = posts.filter(p => {
    if (filter === 'ALL') return true;
    return p.status === filter;
  });

  return (
    <div className="space-y-5">
      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        <div>
          <h2 className="text-sm font-semibold text-white">Broadcast History & Delivery Logs</h2>
          <p className="text-xs text-slate-400">Track delivery status and per-channel links</p>
        </div>

        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {['ALL', 'PUBLISHED', 'PARTIALLY_PUBLISHED', 'SCHEDULED', 'FAILED'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filter === f
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          <Clock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-medium">No posts found for this filter.</p>
          <p className="text-xs text-slate-500 mt-1">Compose and publish a post to see it logged here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map(post => (
            <div
              key={post.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 hover:border-slate-700 transition-colors"
            >
              {/* Post Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-500">Post #{post.id}</span>
                  {getStatusBadge(post.status)}
                  <span className="text-xs text-slate-400">
                    {new Date(post.createdAt).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                {post.scheduledAt && (
                  <span className="text-xs text-indigo-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Scheduled for: {new Date(post.scheduledAt).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Post Body: Media + Text */}
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                {post.mediaUrl ? (
                  <img
                    src={post.mediaUrl}
                    alt="Post Attachment"
                    className="w-24 h-24 rounded-xl object-cover shrink-0 border border-slate-800 bg-slate-950"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 text-slate-600">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                    {post.caption}
                  </p>
                </div>
              </div>

              {/* Per-Platform Delivery Breakdown */}
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
                  Platform Delivery Results ({post.deliveries?.length || 0})
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {post.deliveries?.map(del => {
                    const isSuccess = del.status === 'SUCCESS';
                    return (
                      <div
                        key={del.deliveryId}
                        className={`p-3 rounded-xl border flex flex-col justify-between text-xs ${
                          isSuccess
                            ? 'bg-slate-950/70 border-emerald-500/20'
                            : 'bg-red-950/20 border-red-500/30'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-semibold text-slate-200">{del.platform}</span>
                            {isSuccess ? (
                              <span className="text-emerald-400 font-medium text-[11px] flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Sent
                              </span>
                            ) : (
                              <span className="text-red-400 font-medium text-[11px] flex items-center gap-1">
                                <XCircle className="w-3 h-3" /> Failed
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate mb-2">
                            {del.accountName || del.handle}
                          </div>
                        </div>

                        {/* Action / Error info */}
                        <div>
                          {isSuccess && del.platformPostUrl && (
                            <a
                              href={del.platformPostUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
                            >
                              <span>View live post</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}

                          {!isSuccess && (
                            <div className="space-y-1.5 mt-1">
                              <p className="text-[10px] text-red-300/90 line-clamp-2">
                                {del.errorMessage || 'Unknown error occurred.'}
                              </p>
                              <button
                                onClick={() => handleRetry(del.deliveryId)}
                                disabled={retryingId === del.deliveryId}
                                className="flex items-center gap-1 text-[11px] font-medium text-amber-400 hover:text-amber-300 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20"
                              >
                                <RotateCcw className={`w-3 h-3 ${retryingId === del.deliveryId ? 'animate-spin' : ''}`} />
                                <span>{retryingId === del.deliveryId ? 'Retrying...' : 'Retry'}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
