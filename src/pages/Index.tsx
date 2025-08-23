import { InfluencerDashboard } from '@/components/InfluencerDashboard';

// imagine you fetched this from n8n and stored in a variable `response`
import n8nResponse from "@/data/n8nResponse.json"; // or from API

const Index = () => {
  const dashboardData = n8nResponse[0]?.dashboardData ?? []; 

  return <InfluencerDashboard data={dashboardData} />;
};

export default Index;
