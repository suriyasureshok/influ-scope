import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, TrendingUp, Play, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface MetricsSectionProps {
  data: {
    recommendation?: string;
    avgLikes?: number;
    avgComments?: number;
    engagementRate?: number;
    avgVideoViews?: number;
    posts: Array<{
      likes: number;
      comments: number;
      views: number | null;
    }>;
  };
}

export function MetricsSection({ data }: MetricsSectionProps) {
  // Calculate metrics from posts if not provided
  const totalPosts = data.posts.length;
  const avgLikes = data.avgLikes || (totalPosts > 0 ? Math.round(data.posts.reduce((sum, post) => sum + post.likes, 0) / totalPosts) : 0);
  const avgComments = data.avgComments || (totalPosts > 0 ? Math.round(data.posts.reduce((sum, post) => sum + post.comments, 0) / totalPosts) : 0);
  const avgVideoViews = data.avgVideoViews || (totalPosts > 0 ? 
    Math.round(data.posts.filter(p => p.views).reduce((sum, post) => sum + (post.views || 0), 0) / data.posts.filter(p => p.views).length) || 0 : 0);
  
  // Calculate engagement rate if not provided
  const engagementRate = data.engagementRate || (avgLikes + avgComments > 0 ? 
    Number(((avgLikes + avgComments) / Math.max(avgLikes * 20, 1000) * 100).toFixed(2)) : 0);

  const recommendation = data.recommendation || 'Strong Fit';

  // Get recommendation styling
  const getRecommendationStyle = (rec: string) => {
    const lower = rec.toLowerCase();
    if (lower.includes('strong') || lower.includes('excellent') || lower.includes('perfect')) {
      return { icon: CheckCircle, class: 'bg-success/10 text-success border-success/20', glow: 'shadow-success' };
    } else if (lower.includes('good') || lower.includes('moderate')) {
      return { icon: AlertCircle, class: 'bg-warning/10 text-warning border-warning/20', glow: 'shadow-warning' };
    } else {
      return { icon: XCircle, class: 'bg-destructive/10 text-destructive border-destructive/20', glow: 'shadow-destructive' };
    }
  };

  const recStyle = getRecommendationStyle(recommendation);
  const RecIcon = recStyle.icon;

  const metrics = [
    {
      title: 'Recommendation',
      value: recommendation,
      icon: RecIcon,
      color: 'text-foreground',
      bgColor: recStyle.class,
      isRecommendation: true
    },
    {
      title: 'Avg Likes',
      value: avgLikes.toLocaleString(),
      icon: Heart,
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10 border-pink-500/20'
    },
    {
      title: 'Avg Comments',
      value: avgComments.toLocaleString(),
      icon: MessageCircle,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10 border-blue-500/20'
    },
    {
      title: 'Engagement Rate',
      value: `${engagementRate}%`,
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/10 border-success/20'
    },
    {
      title: 'Avg Video Views',
      value: avgVideoViews.toLocaleString(),
      icon: Play,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10 border-purple-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {metrics.map((metric, index) => (
        <Card
          key={metric.title}
          className={`metric-card border-2 ${metric.bgColor} hover:scale-105 transform transition-all duration-300`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </CardTitle>
            <metric.icon className={`h-4 w-4 ${metric.color}`} />
          </CardHeader>
          <CardContent>
            {metric.isRecommendation ? (
              <Badge className={`${metric.bgColor} font-semibold px-3 py-1`}>
                {metric.value}
              </Badge>
            ) : (
              <div className="text-2xl font-bold">{metric.value}</div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}