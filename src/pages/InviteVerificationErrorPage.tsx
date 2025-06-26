import { AlertCircle, ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PageContainer } from "@/components/PageContainer";
import { Link } from "react-router-dom";

export const InviteVerificationErrorPage = () => {
  return (
    <PageContainer className="flex items-center justify-center">
      <Card className="w-full max-w-md border-destructive/50">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl flex items-center gap-2 text-destructive">
            <AlertCircle className="h-6 w-6" />
            Verification Failed
          </CardTitle>
          <CardDescription>
            We couldn't verify your competition invitation
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Invalid Invitation Link</AlertTitle>
            <AlertDescription>
              The invite link you used appears to be invalid or has expired.
              Please check that you've entered the complete URL correctly.
            </AlertDescription>
          </Alert>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button asChild variant="default" className="w-full sm:w-auto">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go to Home
            </Link>
          </Button>

          <a
            href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL}`}
            className="flex items-center"
          >
            <Mail className="mr-2 h-4 w-4" /> Support:{" "}
            {import.meta.env.VITE_CONTACT_EMAIL}
          </a>
        </CardFooter>
      </Card>
    </PageContainer>
  );
};
