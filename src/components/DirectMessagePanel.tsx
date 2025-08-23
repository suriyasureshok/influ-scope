import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, MessageSquare, CheckCircle, Clock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DirectMessagePanelProps {
  influencerUsername: string;
}

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
}

export function DirectMessagePanel({ influencerUsername }: DirectMessagePanelProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message.trim(),
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Simulate message sending
    toast({
      title: "Message Sent!",
      description: `Your message has been sent to @${influencerUsername}`,
    });

    // Simulate delivery status updates
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'delivered' } 
            : msg
        )
      );
    }, 1000);

    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'delivered' } 
            : msg
        )
      );
      setIsTyping(false);
    }, 3000);
  };

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return <Clock className="h-3 w-3 text-muted-foreground" />;
      case 'delivered':
        return <CheckCircle className="h-3 w-3 text-blue-500" />;
      case 'read':
        return <CheckCircle className="h-3 w-3 text-success" />;
    }
  };

  const getStatusText = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return 'Sent';
      case 'delivered':
        return 'Delivered';
      case 'read':
        return 'Read';
    }
  };

  return (
    <Card className="metric-card h-fit">
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <CardTitle>Direct Message</CardTitle>
        </div>
        <CardDescription>
          Send a message to @{influencerUsername}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Influencer Info */}
        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-medium">@{influencerUsername}</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-xs text-muted-foreground">Available for collaboration</span>
            </div>
          </div>
        </div>

        {/* Messages History */}
        {messages.length > 0 && (
          <div className="space-y-3 max-h-48 overflow-y-auto">
            <h4 className="text-sm font-medium text-muted-foreground">Recent Messages</h4>
            {messages.map((msg) => (
              <div key={msg.id} className="bg-primary/5 border border-primary/10 rounded-lg p-3 animate-slide-up">
                <p className="text-sm mb-2">{msg.text}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{msg.timestamp.toLocaleTimeString()}</span>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(msg.status)}
                    <span>{getStatusText(msg.status)}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                @{influencerUsername} is typing...
              </div>
            )}
          </div>
        )}

        {/* Message Composer */}
        <div className="space-y-3">
          <Textarea
            placeholder={`Hey @${influencerUsername}, I'd love to collaborate with you on...`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[100px] resize-none focus:ring-2 focus:ring-primary/20 transition-smooth"
            maxLength={500}
          />
          
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              {message.length}/500 characters
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>
        </div>

        {/* Quick Templates */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Quick Templates</p>
          <div className="flex flex-wrap gap-2">
            {[
              "Collaboration inquiry",
              "Product partnership",
              "Brand ambassador",
              "Content creation"
            ].map((template) => (
              <Badge
                key={template}
                variant="outline"
                className="cursor-pointer hover:bg-muted/50 transition-colors text-xs"
                onClick={() => setMessage(`Hi @${influencerUsername}, I'm interested in discussing a ${template.toLowerCase()} opportunity with you. `)}
              >
                {template}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}