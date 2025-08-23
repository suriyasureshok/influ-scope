import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, BarChart3, Hash } from 'lucide-react';

interface ChartsSectionProps {
  data: {
    posts?: Array<{
      id: string;
      date: string;
      type: string;
      likes: number;
      comments: number;
      views: number | null;
      hashtags: string[];
    }>;
  };
}

export function ChartsSection({ data }: ChartsSectionProps) {
  // Ensure posts array exists and provide fallback
  const posts = data.posts || [];
  
  // Process data for engagement over time
  const engagementData = posts
    .map(post => ({
      date: new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      engagement: post.likes + post.comments,
      likes: post.likes,
      comments: post.comments
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Process data for video views by post type
  const postTypeData = posts
    .reduce((acc, post) => {
      const existing = acc.find(item => item.type === post.type);
      if (existing) {
        existing.views += post.views || 0;
        existing.count += 1;
      } else {
        acc.push({
          type: post.type,
          views: post.views || 0,
          count: 1
        });
      }
      return acc;
    }, [] as Array<{ type: string; views: number; count: number }>)
    .map(item => ({
      ...item,
      avgViews: Math.round(item.views / item.count)
    }));

  // Process hashtag frequency
  const hashtagData = posts
    .flatMap(post => post.hashtags)
    .reduce((acc, hashtag) => {
      const tag = hashtag.replace('#', '');
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const topHashtags = Object.entries(hashtagData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([tag, count]) => ({ hashtag: tag, count }));

  const COLORS = [
    'hsl(var(--primary))',
    'hsl(var(--secondary))',
    'hsl(var(--success))',
    'hsl(var(--warning))',
    'hsl(var(--primary-glow))',
    'hsl(var(--secondary-glow))',
    'hsl(var(--success-glow))',
    '#ff6b9d'
  ];

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Engagement Over Time */}
      <Card className="metric-card lg:col-span-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>Engagement Over Time</CardTitle>
          </div>
          <CardDescription>
            Track likes and comments performance across recent posts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="engagement" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Video Views by Post Type */}
      <Card className="metric-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-secondary" />
            <CardTitle>Views by Type</CardTitle>
          </div>
          <CardDescription>
            Average views per post type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={postTypeData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                type="number"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                type="category"
                dataKey="type"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                width={60}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="avgViews" 
                fill="hsl(var(--secondary))"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Hashtag Frequency */}
      <Card className="metric-card lg:col-span-3">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Hash className="h-5 w-5 text-success" />
            <CardTitle>Popular Hashtags</CardTitle>
          </div>
          <CardDescription>
            Most frequently used hashtags across posts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topHashtags}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="hashtag"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="hsl(var(--success))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={topHashtags.slice(0, 6)}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="hsl(var(--primary))"
                  dataKey="count"
                  label={({ hashtag, percent }) => `#${hashtag} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {topHashtags.slice(0, 6).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}