import React, { useState } from 'react';
import { SearchForm } from './SearchForm';
import { MetricsSection } from './MetricsSection';
import { ChartsSection } from './ChartsSection';
import { PostsTable } from './PostsTable';
import { DirectMessagePanel } from './DirectMessagePanel';
import { RawJsonViewer } from './RawJsonViewer';
import { Loader2, TrendingUp } from 'lucide-react';

interface InfluencerData {
  username?: string;
  platform?: string;
  followers?: number;
  bio?: string;
  recommendation?: string;
  avgLikes?: number;
  avgComments?: number;
  engagementRate?: number;
  avgVideoViews?: number;
  audienceDemographics: {
    age: Record<string, number>;
    gender: Record<string, number>;
    location: Record<string, string | number>;
  };
  posts: Array<{
    id: string;
    date: string;
    type: string;
    caption: string;
    likes: number;
    comments: number;
    views: number | null;
    hashtags: string[];
  }>;
}

export function InfluencerDashboard() {
  const [influencerData, setInfluencerData] = useState<InfluencerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (formData: { niche: string; targetLocation: string; product: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5678/webhook-test/d2ee137c-127c-43da-904d-95ef70f3e360', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch influencer data');
      }

      const data = await response.json();
      setInfluencerData(data);
    } catch (err) {
      setError('Failed to fetch influencer match. Please check your connection and try again.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

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
        {/* Search Form */}
        <div className="animate-scale-in">
          <SearchForm onSearch={handleSearch} loading={loading} />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Finding your perfect influencer match...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="metric-card border-destructive/20 bg-destructive/5">
            <p className="text-destructive font-medium">{error}</p>
          </div>
        )}

        {/* Dashboard Content */}
        {influencerData && !loading && (
          <div className="space-y-8 animate-slide-up">
            {/* Influencer Profile Header */}
            <div className="metric-card">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-2xl font-bold text-white">
                  {influencerData.username?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">@{influencerData.username || 'unknown'}</h2>
                  <p className="text-muted-foreground mb-2">{influencerData.bio || 'No bio available'}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">
                      {influencerData.platform || 'Unknown Platform'}
                    </span>
                    <span className="text-muted-foreground">
                      {influencerData.followers?.toLocaleString() || '0'} followers
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Section */}
            <MetricsSection data={influencerData} />

            {/* Charts Section */}
            <ChartsSection data={influencerData} />

            {/* Posts Table and DM Panel */}
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <PostsTable posts={influencerData.posts} />
              </div>
              <div>
                <DirectMessagePanel influencerUsername={influencerData.username || 'unknown'} />
              </div>
            </div>

            {/* Raw JSON Viewer */}
            <RawJsonViewer data={influencerData} />
          </div>
        )}
      </div>
    </div>
  );
}