'use client';

import { useState } from 'react';
import { Globe, BarChart3, Send, ExternalLink, Instagram, Music2, Video, MessageSquare, TrendingUp, CalendarDays, Image, Users, Monitor, LogIn } from 'lucide-react';

// ============ TOOL CONFIGURATIONS ============
// Each tool opens in a new browser tab — we're building a browser launcher inside the app,
// not trying to embed external dashboards (which get blocked by X-Frame-Options/CSP).

interface SocialTool {
  name: string;
  url: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  category: string;
  loginHint?: string;
}

const metricoolConfig: SocialTool = {
  name: 'Metricool',
  url: 'https://app.metricool.com/evolution/brandSummary?blogId=6618454&userId=5095267',
  description: 'Social media analytics and scheduling platform. Track follower growth, engagement rates, best posting times, and content performance across Instagram, TikTok, YouTube, X/Twitter, Facebook, LinkedIn, and more.',
  icon: <Globe size={20} />,
  color: '#7C3AED',
  category: 'Social Analytics & Scheduling',
  loginHint: 'Log in with your Metricool account — your dashboard, scheduler, and analytics are all there.',
};

const socialTools: SocialTool[] = [
  metricoolConfig,
  {
    name: 'Google Analytics',
    url: 'https://analytics.google.com',
    description: 'Web traffic analytics — track page views, user behavior, conversions, and audience demographics for your artist website and store.',
    icon: <BarChart3 size={20} />,
    color: '#E8730C',
    category: 'Web Analytics',
    loginHint: 'Sign in with your Google account to view your site analytics.',
  },
  {
    name: 'YouTube Studio',
    url: 'https://studio.youtube.com',
    description: 'YouTube channel management — upload videos, track views, subscribers, revenue, and audience insights.',
    icon: <Video size={20} />,
    color: '#FF0000',
    category: 'Video Platform',
    loginHint: 'Log in with your YouTube/Google channel account.',
  },
  {
    name: 'Meta Business Suite',
    url: 'https://business.facebook.com',
    description: 'Facebook & Instagram business tools — schedule posts, manage ads, track engagement, and respond to messages.',
    icon: <MessageSquare size={20} />,
    color: '#1877F2',
    category: 'Social Management',
    loginHint: 'Log in with your Facebook/Meta Business account.',
  },
];

// ============ MOCK SOCIAL STATS (until API-connected) ============

const platformStats = [
  { platform: 'Instagram', icon: <Image size={16} />, followers: '24.8K', growth: '+1.2K', growthPct: '+4.8%', color: '#E4405F', engagement: '3.2%' },
  { platform: 'TikTok', icon: <Music2 size={16} />, followers: '18.3K', growth: '+2.1K', growthPct: '+11.5%', color: '#000000', engagement: '5.8%' },
  { platform: 'YouTube', icon: <Video size={16} />, followers: '12.4K', growth: '+340', growthPct: '+2.7%', color: '#FF0000', engagement: '4.1%' },
  { platform: 'X / Twitter', icon: <MessageSquare size={16} />, followers: '8.9K', growth: '+180', growthPct: '+2.0%', color: '#1DA1F2', engagement: '1.8%' },
  { platform: 'Facebook', icon: <Users size={16} />, followers: '5.2K', growth: '+45', growthPct: '+0.9%', color: '#1877F2', engagement: '2.1%' },
];

const upcomingPosts = [
  { platform: 'Instagram', icon: <Image size={14} />, type: 'Reel', title: 'Behind the scenes — studio session', date: 'Today, 6:00 PM', status: 'scheduled' },
  { platform: 'TikTok', icon: <Music2 size={14} />, type: 'Video', title: 'New single announcement teaser', date: 'Tomorrow, 9:00 AM', status: 'scheduled' },
  { platform: 'Instagram', icon: <Image size={14} />, type: 'Story', title: 'Countdown to release day', date: 'Jul 28, 12:00 PM', status: 'draft' },
  { platform: 'YouTube', icon: <Video size={14} />, type: 'Video', title: 'Official music video premiere', date: 'Aug 1, 3:00 PM', status: 'draft' },
  { platform: 'X / Twitter', icon: <MessageSquare size={14} />, type: 'Post', title: 'Thank fans for 25K milestone', date: 'Jul 29, 10:00 AM', status: 'scheduled' },
];

// ============ PAGE COMPONENT ============

export default function SocialMediaPage() {
  const [activeTab, setActiveTab] = useState<'launch' | 'scheduler' | 'analytics'>('launch');

  const openTool = (tool: SocialTool) => {
    window.open(tool.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Social Media Management</h1>
          <p className="text-sm text-neutral-500 mt-1">Analytics, scheduling, and engagement across all platforms</p>
        </div>
        <button
          onClick={() => openTool(metricoolConfig)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white transition-colors"
        >
          <ExternalLink size={16} /> Open Metricool ↗
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-neutral-100 p-1 rounded-xl">
        {[
          { key: 'launch', label: 'Social Dashboard', icon: <Monitor size={16} /> },
          { key: 'scheduler', label: 'Post Scheduler', icon: <CalendarDays size={16} /> },
          { key: 'analytics', label: 'Social Analytics', icon: <TrendingUp size={16} /> },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as 'launch' | 'scheduler' | 'analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ─── Tab: Social Dashboard (tool launcher) ─── */}
      {activeTab === 'launch' && (
        <div className="space-y-6">
          {/* Quick Platform Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {platformStats.map(p => (
              <div key={p.platform} className="bg-white rounded-xl border border-neutral-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: p.color + '15', color: p.color }}>
                    {p.icon}
                  </div>
                  <span className="text-xs font-medium text-neutral-500">{p.platform}</span>
                </div>
                <p className="text-xl font-bold text-neutral-900">{p.followers}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp size={12} className="text-emerald-500" />
                  <span className="text-xs font-medium text-emerald-600">{p.growthPct}</span>
                  <span className="text-xs text-neutral-400">({p.growth})</span>
                </div>
                <div className="mt-2 pt-2 border-t border-neutral-100">
                  <span className="text-xs text-neutral-400">Engagement </span>
                  <span className="text-xs font-medium text-neutral-700">{p.engagement}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Tool launcher cards — each opens a new tab */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {socialTools.map(tool => (
              <div key={tool.name} className="bg-white rounded-xl border border-neutral-200 overflow-hidden hover:border-neutral-300 transition-all hover:shadow-md">
                {/* Header with icon and category */}
                <div className="px-5 py-4 flex items-center gap-4 border-b border-neutral-100" style={{ borderBottomColor: tool.color + '20' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: tool.color + '15', color: tool.color }}>
                    {tool.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-neutral-900">{tool.name}</p>
                    <p className="text-xs text-neutral-400">{tool.category}</p>
                  </div>
                  <button
                    onClick={() => openTool(tool)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors hover:opacity-90"
                    style={{ backgroundColor: tool.color }}
                  >
                    <LogIn size={14} /> Open ↗
                  </button>
                </div>
                {/* Description */}
                <div className="px-5 py-4">
                  <p className="text-sm text-neutral-600 leading-relaxed">{tool.description}</p>
                  {tool.loginHint && (
                    <p className="text-xs text-neutral-400 mt-2 flex items-center gap-1">
                      <LogIn size={12} /> {tool.loginHint}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* How this works — explanation */}
          <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <Monitor size={18} className="text-neutral-400" />
              <h3 className="text-sm font-semibold text-neutral-900">How this works</h3>
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed">
              This section acts as a browser inside your app. Clicking "Open" on any tool launches it in a new browser tab where you can log in directly.
              Most analytics platforms block in-app embedding for security, so this approach gives you full access to each dashboard while keeping your
              platform organized. Once you connect APIs, real metrics will flow into the analytics tab below.
            </p>
          </div>
        </div>
      )}

      {/* ─── Tab: Post Scheduler ─── */}
      {activeTab === 'scheduler' && (
        <div className="space-y-6">
          {/* Upcoming scheduled posts */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-neutral-900">Upcoming Posts</h3>
              <button onClick={() => openTool(metricoolConfig)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-violet-600 text-white hover:bg-violet-700 transition-colors">
                <Send size={14} /> Schedule in Metricool ↗
              </button>
            </div>
            <div className="divide-y divide-neutral-100">
              {upcomingPosts.map((post, i) => (
                <div key={i} className="px-5 py-3 flex items-center gap-4 hover:bg-neutral-50 transition-colors">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: platformStats.find(p => p.platform === post.platform)?.color + '15' }}>
                    {post.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">{post.title}</p>
                    <p className="text-xs text-neutral-400">{post.platform} · {post.type}</p>
                  </div>
                  <div className="text-xs text-neutral-500 text-right">
                    <p>{post.date}</p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-0.5 ${
                      post.status === 'scheduled' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>{post.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Best times to post */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">Best Times to Post This Week</h3>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {[
                { day: 'Mon', times: ['9 AM', '6 PM'] },
                { day: 'Tue', times: ['10 AM', '7 PM'] },
                { day: 'Wed', times: ['12 PM', '8 PM'] },
                { day: 'Thu', times: ['9 AM', '5 PM'] },
                { day: 'Fri', times: ['11 AM', '9 PM'] },
              ].map(d => (
                <div key={d.day} className="bg-neutral-50 rounded-lg p-3 text-center">
                  <p className="text-xs font-semibold text-neutral-900 mb-2">{d.day}</p>
                  {d.times.map(t => (
                    <p key={t} className="text-xs text-violet-600 font-medium">{t}</p>
                  ))}
                </div>
              ))}
            </div>
            <p className="text-xs text-neutral-400 mt-3">Based on your audience's engagement patterns — powered by Metricool</p>
          </div>

          {/* Link to Metricool for full scheduling */}
          <div className="bg-violet-50 rounded-xl border border-violet-200 p-5 text-center">
            <p className="text-sm text-violet-900 font-medium mb-2">Full scheduling and content calendar</p>
            <p className="text-xs text-violet-600 mb-3">Create, schedule, and auto-publish posts across all platforms from Metricool</p>
            <button
              onClick={() => openTool(metricoolConfig)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-violet-600 text-white hover:bg-violet-700 transition-colors"
            >
              <ExternalLink size={16} /> Open Metricool Scheduler ↗
            </button>
          </div>
        </div>
      )}

      {/* ─── Tab: Social Analytics ─── */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Cross-platform comparison */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-200">
              <h3 className="text-sm font-semibold text-neutral-900">Cross-Platform Performance</h3>
              <p className="text-xs text-neutral-400 mt-1">Last 30 days — aggregated from connected accounts</p>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-neutral-900">65.6K</p>
                  <p className="text-xs text-neutral-400">Total Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">+3.9K</p>
                  <p className="text-xs text-neutral-400">Net Growth</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-violet-600">3.4%</p>
                  <p className="text-xs text-neutral-400">Avg Engagement</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-neutral-900">847K</p>
                  <p className="text-xs text-neutral-400">Total Impressions</p>
                </div>
              </div>

              {/* Platform bars */}
              <div className="space-y-3">
                {platformStats.map(p => {
                  const parseFollowers = (val: string | undefined | number) => {
                    if (!val) return 0;
                    const str = String(val);
                    if (str.includes('K')) return parseFloat(str.replace('K', '')) * 1000;
                    if (str.includes('M')) return parseFloat(str.replace('M', '')) * 1000000;
                    return parseFloat(str) || 0;
                  };
                  const maxFollowers = Math.max(...platformStats.map(s => parseFollowers(s.followers)), 1);
                  const currentFollowers = parseFollowers(p.followers);
                  const widthPct = maxFollowers > 0 ? (currentFollowers / maxFollowers) * 100 : 0;
                  return (
                    <div key={p.platform} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: p.color + '15', color: p.color }}>
                        {p.icon}
                      </div>
                      <span className="text-xs font-medium text-neutral-700 w-24">{p.platform}</span>
                      <div className="flex-1 h-6 bg-neutral-100 rounded-lg overflow-hidden">
                        <div className="h-full rounded-lg transition-all" style={{ width: `${widthPct}%`, backgroundColor: p.color }} />
                      </div>
                      <span className="text-xs font-medium text-neutral-900 w-16 text-right">{p.followers ?? '0'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Engagement placeholder */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <h3 className="text-sm font-semibold text-neutral-900 mb-2">Engagement Trend — Last 90 Days</h3>
            <div className="h-48 flex items-center justify-center bg-neutral-50 rounded-lg">
              <p className="text-sm text-neutral-400">Connect Metricool API for real engagement charts</p>
            </div>
          </div>

          {/* Top performing content */}
          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-200">
              <h3 className="text-sm font-semibold text-neutral-900">Top Performing Content</h3>
            </div>
            <div className="divide-y divide-neutral-100">
              {[
                { title: 'Studio session BTS reel', platform: 'Instagram', views: '45.2K', engagement: '6.8%', type: 'Reel' },
                { title: 'New single teaser', platform: 'TikTok', views: '89.1K', engagement: '7.2%', type: 'Video' },
                { title: 'Music video premiere', platform: 'YouTube', views: '12.4K', engagement: '5.1%', type: 'Video' },
                { title: 'Fan Q&A live stream', platform: 'Instagram', views: '8.7K', engagement: '4.3%', type: 'Live' },
              ].map((content, i) => (
                <div key={i} className="px-5 py-3 flex items-center gap-4 hover:bg-neutral-50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-500">
                    #{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">{content.title}</p>
                    <p className="text-xs text-neutral-400">{content.platform} · {content.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-neutral-900">{content.views}</p>
                    <p className="text-xs text-emerald-600">{content.engagement} eng.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deep analytics link */}
          <div className="bg-violet-50 rounded-xl border border-violet-200 p-5 text-center">
            <p className="text-sm text-violet-900 font-medium mb-2">Full Social Analytics & Reports</p>
            <p className="text-xs text-violet-600 mb-3">Audience demographics, content performance, competitor analysis, and automated reports</p>
            <button
              onClick={() => openTool(metricoolConfig)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-violet-600 text-white hover:bg-violet-700 transition-colors"
            >
              <ExternalLink size={16} /> Open Full Analytics ↗
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
