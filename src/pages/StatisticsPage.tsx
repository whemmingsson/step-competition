import { PageContainer } from "@/components/PageContainer";
import { Card } from "@/components/ui/card";

export const StatisticsPage = () => {
  return (
    <PageContainer>
      <Card>
        <h1 className="text-2xl font-bold">Statistics</h1>
        <p className="mt-4">
          This page will display various statistics related to the application.
        </p>
        {/* Add your statistics components here */}
      </Card>
    </PageContainer>
  );
};
