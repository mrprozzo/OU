import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-4 border-red-200 dark:border-red-900">
        <CardContent className="pt-6">
          <div className="flex items-center mb-4 gap-3">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold">Page Not Found</h1>
          </div>

          <p className="mt-4 text-muted-foreground">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </CardContent>
        <CardFooter>
          <Link href="/">
            <Button className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Go back to home
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
