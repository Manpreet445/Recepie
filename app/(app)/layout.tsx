import AppNav from "@/components/nav/AppNav";
import AppFooter from "@/components/footer/AppFooter";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppNav />
      <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 md:px-8 md:py-14">
        {children}
      </main>
      <AppFooter />
    </>
  );
}
