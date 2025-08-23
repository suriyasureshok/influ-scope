
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Search } from 'lucide-react';

interface FormData {
  niche: string;
  targetLocation: string;
  product: string;
}

interface InfluencerFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

const InfluencerForm: React.FC<InfluencerFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<FormData>({
    niche: '',
    targetLocation: '',
    product: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <Card className="form-section">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 dashboard-gradient rounded-lg">
          <Search className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-primary">Find Your Perfect Influencer</h2>
          <p className="text-sm text-muted-foreground">Enter your campaign details to get personalized recommendations</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="niche" className="text-sm font-medium text-primary">Niche</Label>
            <Input
              id="niche"
              type="text"
              placeholder="e.g., Travel, Fashion, Tech"
              value={formData.niche}
              onChange={handleInputChange('niche')}
              className="h-11"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium text-primary">Target Location</Label>
            <Input
              id="location"
              type="text"
              placeholder="e.g., USA, Europe, Global"
              value={formData.targetLocation}
              onChange={handleInputChange('targetLocation')}
              className="h-11"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="product" className="text-sm font-medium text-primary">Product</Label>
            <Input
              id="product"
              type="text"
              placeholder="e.g., Eco-friendly backpack"
              value={formData.product}
              onChange={handleInputChange('product')}
              className="h-11"
            />
          </div>
        </div>
        
        <Button 
          type="submit" 
          disabled={isLoading || !formData.niche || !formData.targetLocation || !formData.product}
          className="w-full h-12 dashboard-gradient text-white font-semibold text-base hover:opacity-90 disabled:opacity-50"
        >
          {isLoading ? 'Analyzing...' : 'Find Influencer Match'}
        </Button>
      </form>
    </Card>
  );
};

export default InfluencerForm;
