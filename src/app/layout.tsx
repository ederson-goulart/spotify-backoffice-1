import "./globals.css";

import Header from "./components/Header/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="border-4 border-blue-800">
          <Header />
        </div>
        {children}
      </body>
    </html>
  );
}
