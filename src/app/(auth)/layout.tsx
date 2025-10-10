import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s",
    default: "Auth",
  },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="flex-center min-h-screen w-full">{children}</div>
    </>
  );
};

export default RootLayout;
