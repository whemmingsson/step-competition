import Login from "@/components/Login";
import { PageContainer } from "@/components/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const LoginPage = () => {
  return (
    <PageContainer>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Login to start participate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Login />
        </CardContent>
      </Card>
    </PageContainer>
  );
};
