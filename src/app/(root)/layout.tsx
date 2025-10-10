import Footer from "@/components/shared/footer/footer";
import Header from "@/components/shared/header";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Products",
};

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
