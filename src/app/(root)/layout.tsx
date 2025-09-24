import Footer from "@/components/shared/footer/footer";
import Header from "@/components/shared/header/header";
import React from "react";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 wrapper">{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default RootLayout;
