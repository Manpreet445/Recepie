import AppNav from "@/components/nav/AppNav";
import AppFooter from "@/components/footer/AppFooter";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppNav />
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-8 py-8">
        {children}
      </main>
      <AppFooter />
    </>
  );
}
