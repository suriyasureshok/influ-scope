import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Search, Calendar, Heart, MessageCircle, Eye, Hash, ChevronUp, ChevronDown } from 'lucide-react';

interface Post {
  id: string;
  date: string;
  type: string;
  caption: string;
  likes: number;
  comments: number;
  views: number | null;
  hashtags: string[];
}

interface PostsTableProps {
  posts?: Post[];
}

type SortField = 'date' | 'likes' | 'comments' | 'views';
type SortDirection = 'asc' | 'desc';

export function PostsTable({ posts = [] }: PostsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Filter posts based on search term
  const filteredPosts = posts.filter(post =>
    post.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.hashtags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    let aValue: number | string = a[sortField] || 0;
    let bValue: number | string = b[sortField] || 0;

    if (sortField === 'date') {
      aValue = new Date(a.date).getTime();
      bValue = new Date(b.date).getTime();
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return sortDirection === 'asc' 
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  const getPostTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'reel':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'post':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'story':
        return 'bg-pink-500/10 text-pink-500 border-pink-500/20';
      case 'igtv':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <Card className="metric-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <CardTitle>Posts Analysis</CardTitle>
        </div>
        <CardDescription>
          Detailed performance metrics for all posts
        </CardDescription>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts, captions, or hashtags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead className="w-[100px]">Type</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('date')}
                      className="h-auto p-0 font-medium hover:bg-transparent"
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Date
                      <SortIcon field="date" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('likes')}
                      className="h-auto p-0 font-medium hover:bg-transparent"
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      Likes
                      <SortIcon field="likes" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('comments')}
                      className="h-auto p-0 font-medium hover:bg-transparent"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Comments
                      <SortIcon field="comments" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('views')}
                      className="h-auto p-0 font-medium hover:bg-transparent"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Views
                      <SortIcon field="views" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      <Hash className="h-4 w-4 mr-1" />
                      Hashtags
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPosts.map((post, index) => (
                  <TableRow 
                    key={post.id}
                    className="hover:bg-card-hover transition-colors"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableCell className="font-mono text-sm">
                      {post.id}
                    </TableCell>
                    <TableCell>
                      <Badge className={getPostTypeColor(post.type)}>
                        {post.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: '2-digit'
                      })}
                    </TableCell>
                    <TableCell className="font-medium">
                      {post.likes.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium">
                      {post.comments.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium">
                      {post.views ? post.views.toLocaleString() : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {post.hashtags.slice(0, 3).map((tag, tagIndex) => (
                          <Badge 
                            key={tagIndex} 
                            variant="outline" 
                            className="text-xs bg-muted/30 hover:bg-muted/50 transition-colors"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {post.hashtags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{post.hashtags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        
        {sortedPosts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? 'No posts found matching your search.' : 'No posts available.'}
          </div>
        )}
        
        <div className="mt-4 text-sm text-muted-foreground text-center">
          Showing {sortedPosts.length} of {posts.length} posts
        </div>
      </CardContent>
    </Card>
  );
}