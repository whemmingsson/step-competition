import Login from "@/components/Login";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const LoginPage = () => {
  return (
    <div className="container max-w-xl py-10 flex min-h-screen items-center justify-center">
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
    </div>
  );
};
