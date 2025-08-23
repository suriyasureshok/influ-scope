import React, { useState } from 'react';
import InfluencerForm from '@/components/InfluencerForm';
import { InfluencerDashboard } from '@/components/InfluencerDashboard';
import n8nResponse from '@/data/n8nResponse.json';

const Index = () => {
  const allData = n8nResponse[0]?.dashboardData ?? [];
  const [filteredData, setFilteredData] = useState<any[] | null>(null); // null initially
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = (formData: { niche: string; targetLocation: string; product: string }) => {
    setIsLoading(true);

    setTimeout(() => {
      const filtered = allData.filter((inf: any) => {
        const nicheMatch = inf.niche?.toLowerCase().includes(formData.niche.toLowerCase());
        const locationMatch = inf.targetLocation?.toLowerCase().includes(formData.targetLocation.toLowerCase());
        const productMatch = inf.product?.toLowerCase().includes(formData.product.toLowerCase());
        return nicheMatch && locationMatch && productMatch;
      });

      setFilteredData(filtered.length ? filtered : allData); // show all if no match
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6 text-center space-y-2">
          <h1 className="text-4xl font-bold dashboard-gradient bg-clip-text text-transparent">
            Influencer Intelligence Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover, analyze, and connect with the perfect influencers for your brand
          </p>
        </div>
      </div>

      {/* Form below header */}
      <div className="container mx-auto px-4 py-6">
        <InfluencerForm onSubmit={handleFormSubmit} isLoading={isLoading} />
      </div>

      {/* Dashboard */}
      <div className="container mx-auto px-4 py-8">
        {isLoading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-primary mt-4">Finding the perfect influencer match...</p>
          </div>
        )}

        {filteredData && !isLoading && (
          <InfluencerDashboard data={filteredData} />
        )}
      </div>
    </div>
  );
};

export default Index;
