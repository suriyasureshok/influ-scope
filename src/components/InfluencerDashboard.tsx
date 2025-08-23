import React from 'react';
import { MetricsSection } from './MetricsSection';
import { ChartsSection } from './ChartsSection';
import { PostsTable } from './PostsTable';
import { DirectMessagePanel } from './DirectMessagePanel';
import { RawJsonViewer } from './RawJsonViewer';
import { TrendingUp } from 'lucide-react';

interface InfluencerDashboardProps {
  data: any[];
}

export const InfluencerDashboard = ({ data }: InfluencerDashboardProps) => {
  if (!data || data.length === 0) {
    return <div>No influencer data found</div>;
  }

  const influencer = data[0]; // since you have one influencer in your sample

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent" />
        <div className="relative container mx-auto px-6 py-12">
          <div className="text-center mb-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Influencer Analytics</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Influencer Intelligence Dashboard
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover, analyze, and connect with the perfect influencers for your brand
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-12 space-y-8">
        {/* Dashboard Content */}
        <div className="space-y-8 animate-slide-up">
          {/* Influencer Profile Header */}
          <div className="metric-card">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-2xl font-bold text-white">
                {influencer.overview?.fullName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{influencer.overview?.fullName || 'Unknown'}</h2>
                <p className="text-muted-foreground mb-2">@{influencer.overview?.username || 'unknown'}</p>
                <p className="text-muted-foreground mb-2">{influencer.overview?.bio || 'No bio available'}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">
                    {influencer.overview?.platform || 'Unknown Platform'}
                  </span>
                  <span className="text-muted-foreground">
                    {influencer.overview?.followers?.toLocaleString() || '0'} followers
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Section */}
          <MetricsSection data={influencer} />

          {/* Charts Section */}
          <ChartsSection data={influencer} />

          {/* Posts Table and DM Panel */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <PostsTable posts={influencer.posts || []} />
            </div>
            <div>
              <DirectMessagePanel influencerUsername={influencer.overview?.username || 'unknown'} />
            </div>
          </div>

          {/* Raw JSON Viewer */}
          <RawJsonViewer data={influencer} />
        </div>
      </div>
    </div>
  );
};