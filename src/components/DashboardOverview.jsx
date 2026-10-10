import React from 'react';
import { Send, CheckCircle2, Clock, Users, ArrowUpRight, TrendingUp, RefreshCw, PenSquare } from 'lucide-react';

export default function DashboardOverview({ stats, onRefresh, onComposeClick }) {
  if (!stats) return null;

  const statCards = [
    {
      title: 'Total Published Posts',
      value: stats.publishedPosts ?? 0,
      sub: `${stats.totalPosts ?? 0} total created`,
      icon: Send,
      color: 'from-indigo-600 to-indigo-700',
      text: 'text-indigo-400'
    },
    {
      title: 'Delivery Success Rate',
      value: `${stats.successRate ?? 100}%`,
      sub: `${stats.failedPosts ?? 0} failed retries`,
      icon: CheckCircle2,
      color: 'from-emerald-600 to-teal-700',
      text: 'text-emerald-400'
    },
    {
      title: 'Active Connected Channels',
      value: stats.connectedAccounts ?? 0,
      sub: 'Facebook, Instagram, LinkedIn, X',
      icon: Users,
      color: 'from-violet-600 to-purple-700',
      text: 'text-violet-400'
    },
    {
      title: 'Scheduled Queue',
      value: stats.scheduledPosts ?? 0,
      sub: 'Awaiting dispatch time',
      icon: Clock,
      color: 'from-amber-600 to-orange-700',
      text: 'text-amber-400'
    },
  ];

  const platformBreakdown = [
    { name: 'Instagram', key: 'INSTAGRAM', color: 'bg-pink-500', count: stats.postsByPlatform?.INSTAGRAM ?? 0 },
    { name: 'Facebook', key: 'FACEBOOK', color: 'bg-blue-600', count: stats.postsByPlatform?.FACEBOOK ?? 0 },
    { name: 'LinkedIn', key: 'LINKEDIN', color: 'bg-blue-700', count: stats.postsByPlatform?.LINKEDIN ?? 0 },
    { name: 'X / Twitter', key: 'TWITTER', color: 'bg-slate-700', count: stats.postsByPlatform?.TWITTER ?? 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            Social Publishing Hub
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-normal">Active</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Broadcast messages and multimedia across Instagram, Facebook, LinkedIn, and Twitter in a single click with automated API dispatching.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <button
            onClick={onComposeClick}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
          >
            <PenSquare className="w-3.5 h-3.5" /> Compose New Post
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400">{card.title}</span>
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${card.color} flex items-center justify-center text-white shadow-md`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">{card.value}</div>
              <div className="text-[11px] text-slate-500 mt-1">{card.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Platform Delivery Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <h2 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            Deliveries by Platform
          </h2>
          <p className="text-xs text-slate-400 mb-4">Total posts successfully broadcasted to each channel</p>

          <div className="space-y-3.5">
            {platformBreakdown.map(p => {
              const max = Math.max(...platformBreakdown.map(i => i.count), 1);
              const percentage = Math.round((p.count / max) * 100);
              return (
                <div key={p.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200">{p.name}</span>
                    <span className="text-slate-400 font-mono">{p.count} posts</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full ${p.color} transition-all duration-500 rounded-full`}
                      style={{ width: `${Math.max(percentage, 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Workflows / Highlights */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
          <h2 className="text-sm font-semibold text-white mb-1">Architecture Highlights</h2>
          <p className="text-xs text-slate-400">Key engineering features in this solution</p>

          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 text-[10px] font-bold">1</span>
              <div>
                <strong className="text-white block font-medium">Strategy Pattern Dispatcher</strong>
                <span>Extensible `SocialPublisher` interface enables plugging in any new network without refactoring existing logic.</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0 text-[10px] font-bold">2</span>
              <div>
                <strong className="text-white block font-medium">Meta Instagram Two-Step Flow</strong>
                <span>Complies with Meta Graph API 2024 spec: media container creation followed by `/media_publish`.</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 text-[10px] font-bold">3</span>
              <div>
                <strong className="text-white block font-medium">Granular Error & Retry Support</strong>
                <span>If Facebook succeeds but Instagram fails due to aspect ratio, you can fix and retry Instagram alone!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
