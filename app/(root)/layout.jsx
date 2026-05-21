import Header from "@/components/Header";

const Layout = ({ children }) => {
  return (
    <main className="min-h-screen text-gray-400">
      {/* Header */}
      <Header />

      {/* Main content */}
      <div className="container py-10">{children}</div>
    </main>
  );
};

export default Layout;
