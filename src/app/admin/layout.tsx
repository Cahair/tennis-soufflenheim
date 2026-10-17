import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Administration · TPCS" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-screen bg-night-50">{children}</div>;
}
