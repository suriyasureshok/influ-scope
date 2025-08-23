import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Copy, Download, Code, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RawJsonViewerProps {
  data: any;
}

export function RawJsonViewer({ data }: RawJsonViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const jsonString = JSON.stringify(data, null, 2);
  const dataSize = new Blob([jsonString]).size;
  const formattedSize = dataSize < 1024 
    ? `${dataSize} bytes` 
    : `${(dataSize / 1024).toFixed(1)} KB`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "JSON data has been copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy JSON data to clipboard",
        variant: "destructive"
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `influencer-data-${data.username || 'export'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "JSON file has been downloaded",
    });
  };

  const getJsonStats = () => {
    const stats = {
      posts: data.posts?.length || 0,
      hashtags: data.posts?.reduce((acc: number, post: any) => acc + (post.hashtags?.length || 0), 0) || 0,
      totalLikes: data.posts?.reduce((acc: number, post: any) => acc + (post.likes || 0), 0) || 0,
      totalComments: data.posts?.reduce((acc: number, post: any) => acc + (post.comments || 0), 0) || 0,
    };
    return stats;
  };

  const stats = getJsonStats();

  return (
    <Card className="metric-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Raw JSON Data</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-muted/30">
              {formattedSize}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="hover:bg-muted/50"
            >
              {copied ? (
                <CheckCircle className="h-4 w-4 text-success" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="hover:bg-muted/50"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription>
          Complete influencer data in JSON format for API integration
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Data Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <div className="text-2xl font-bold text-primary">{stats.posts}</div>
            <div className="text-xs text-muted-foreground">Posts</div>
          </div>
          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <div className="text-2xl font-bold text-secondary">{stats.hashtags}</div>
            <div className="text-xs text-muted-foreground">Hashtags</div>
          </div>
          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <div className="text-2xl font-bold text-success">{stats.totalLikes.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Total Likes</div>
          </div>
          <div className="text-center p-3 bg-muted/20 rounded-lg">
            <div className="text-2xl font-bold text-warning">{stats.totalComments.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Total Comments</div>
          </div>
        </div>

        {/* Collapsible JSON Viewer */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-between hover:bg-muted/50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                {isOpen ? 'Hide' : 'Show'} JSON Data
              </span>
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <div className="relative">
              <pre className="bg-muted/30 border border-border rounded-lg p-4 text-sm overflow-auto max-h-96 font-mono">
                <code className="text-foreground whitespace-pre">
                  {jsonString}
                </code>
              </pre>
              
              {/* Copy button overlay */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1 text-success" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* API Integration Help */}
        <div className="mt-4 p-4 bg-primary/5 border border-primary/10 rounded-lg">
          <h4 className="font-medium text-sm mb-2 text-primary">API Integration</h4>
          <p className="text-sm text-muted-foreground mb-2">
            Use this JSON structure when integrating with your application or database.
          </p>
          <div className="text-xs font-mono bg-background/50 p-2 rounded border">
            POST /api/influencers<br />
            Content-Type: application/json
          </div>
        </div>
      </CardContent>
    </Card>
  );
}