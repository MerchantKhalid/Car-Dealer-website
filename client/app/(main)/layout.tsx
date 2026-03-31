import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { HomeThemeProvider } from '@/context/HomeThemeContext';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HomeThemeProvider>
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 transition-colors duration-300">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </HomeThemeProvider>
  );
}
