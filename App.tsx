import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import AndroidAppLayout from "@/pages/android-app-layout";
import { ThemeProvider } from "@/components/ui/theme-provider";
import SimpleLayout from "./components/simple-layout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={SimpleLayout} />
      <Route path="/android" component={AndroidAppLayout} />
      <Route path="/history" component={AndroidAppLayout} />
      <Route path="/settings" component={AndroidAppLayout} />
      <Route path="*" component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <QueryClientProvider client={queryClient}>
        <Router />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
