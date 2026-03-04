import React from "react";

interface PageLayoutProps {
  topBar: React.ReactNode;
  contextHeader: React.ReactNode;
  primaryWorkspace: React.ReactNode;
  secondaryPanel: React.ReactNode;
  proofFooter: React.ReactNode;
}

const PageLayout = ({
  topBar,
  contextHeader,
  primaryWorkspace,
  secondaryPanel,
  proofFooter,
}: PageLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {topBar}
      {contextHeader}

      <div className="flex flex-1 overflow-hidden">
        {/* Primary Workspace — 70% */}
        <main className="w-[70%] overflow-y-auto p-3 border-r">
          {primaryWorkspace}
        </main>

        {/* Secondary Panel — 30% */}
        <div className="w-[30%] overflow-y-auto p-3">
          {secondaryPanel}
        </div>
      </div>

      {proofFooter}
    </div>
  );
};

export default PageLayout;
