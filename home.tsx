import React, { useState } from "react";
import { Header } from "@/components/header";
import { Converter } from "@/components/converter";
import { RecentConversions } from "@/components/recent-conversions";
import { MobileNavigation } from "@/components/mobile-navigation";
import { ErrorDialog } from "@/components/error-dialog";

export default function Home() {
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const showError = (message: string) => {
    setErrorMessage(message);
    setErrorDialogOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Main content area */}
      <main className="flex-grow pt-20 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Converter />
          <RecentConversions />
        </div>
      </main>
      
      <MobileNavigation />
      
      <ErrorDialog 
        isOpen={errorDialogOpen}
        onClose={() => setErrorDialogOpen(false)}
        errorMessage={errorMessage}
      />
    </div>
  );
}
