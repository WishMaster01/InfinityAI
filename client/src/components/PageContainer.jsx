import React from "react";

const PageContainer = ({ children, className = "" }) => (
  <div
    className={`min-w-0 flex-1 overflow-y-auto bg-[var(--ia-background)] p-4 pb-24 sm:p-6 sm:pb-6 lg:p-8 ${className}`}
  >
    {children}
  </div>
);

export default PageContainer;
