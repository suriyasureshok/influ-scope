import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Sparkles } from 'lucide-react';

interface SearchFormProps {
  onSearch: (data: { niche: string; targetLocation: string; product: string }) => void;
  loading: boolean;
}

export function SearchForm({ onSearch, loading }: SearchFormProps) {
  const [formData, setFormData] = useState({
    niche: '',
    targetLocation: '',
    product: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.niche && formData.targetLocation && formData.product) {
      onSearch(formData);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.niche && formData.targetLocation && formData.product;

  return (
    <Card className="metric-card border-primary/20">
      <CardHeader className="text-center">
        <div className="inline-flex items-center gap-2 justify-center mb-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl">Find Your Perfect Influencer</CardTitle>
        </div>
        <CardDescription>
          Enter your campaign details to discover matching influencers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="niche" className="text-sm font-medium">
                Niche
              </Label>
              <Input
                id="niche"
                placeholder="e.g., Travel, Fashion, Tech"
                value={formData.niche}
                onChange={(e) => handleInputChange('niche', e.target.value)}
                className="transition-smooth focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="targetLocation" className="text-sm font-medium">
                Target Location
              </Label>
              <Input
                id="targetLocation"
                placeholder="e.g., USA, Europe, Global"
                value={formData.targetLocation}
                onChange={(e) => handleInputChange('targetLocation', e.target.value)}
                className="transition-smooth focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="product" className="text-sm font-medium">
                Product
              </Label>
              <Input
                id="product"
                placeholder="e.g., Skincare, Gadgets, Clothing"
                value={formData.product}
                onChange={(e) => handleInputChange('product', e.target.value)}
                className="transition-smooth focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={!isFormValid || loading}
              className="px-8 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-primary text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Find Influencer Match
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}