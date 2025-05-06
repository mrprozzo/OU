import React, { useState, Suspense } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { SunMoon, Languages, History, Settings as SettingsIcon, Loader2 } from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";
import { Button } from "@/components/ui/button";

const LoadingFallback = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="flex flex-col items-center gap-2">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Import our modern translator component
import { ModernTranslator } from "../components/modern-translator";

// Translator tab content
const TranslateTabContent = () => (
  <ModernTranslator />
);

// Import modern history component
import { ModernHistory } from "../components/modern-history";

const HistoryTabContent = () => (
  <ModernHistory />
);

// Import modern settings component
import { ModernSettings } from "../components/modern-settings";

const SettingsTabContent = () => (
  <ModernSettings />
);

export function AppLayout() {
  const [activeTab, setActiveTab] = useState("translate");
  const { theme, setTheme } = useTheme();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col p-4 pb-20 md:p-6 md:pb-6">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Bangla Translator
        </h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          <SunMoon className="h-5 w-5" />
        </Button>
      </header>

      <Card className="flex-1 overflow-hidden shadow-md">
        <Tabs
          defaultValue="translate"
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full h-full flex flex-col"
        >
          <div className="border-b">
            <TabsList className="w-full h-12 rounded-none bg-background justify-between">
              <TabsTrigger
                value="translate"
                className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                <Languages className="h-4 w-4 mr-2 md:mr-2" />
                <span className="hidden md:inline">Translate</span>
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                <History className="h-4 w-4 mr-2 md:mr-2" />
                <span className="hidden md:inline">History</span>
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                <SettingsIcon className="h-4 w-4 mr-2 md:mr-2" />
                <span className="hidden md:inline">Settings</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-auto">
            <TabsContent value="translate" className="h-full mt-0 p-0">
              <Suspense fallback={<LoadingFallback />}>
                <TranslateTabContent />
              </Suspense>
            </TabsContent>
            <TabsContent value="history" className="h-full mt-0 p-0">
              <Suspense fallback={<LoadingFallback />}>
                <HistoryTabContent />
              </Suspense>
            </TabsContent>
            <TabsContent value="settings" className="h-full mt-0 p-0">
              <Suspense fallback={<LoadingFallback />}>
                <SettingsTabContent />
              </Suspense>
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
}

export default AppLayout;