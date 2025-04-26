import { ClientAuthProvider } from '@/components/auth-provider';
import { NavBar } from '@/components/nav-bar';

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientAuthProvider>
      <div className="flex min-h-screen w-full flex-col">
        <NavBar />
        <div className="flex-1 overflow-x-hidden w-full">
          <div className="px-4 sm:px-6 md:px-8 py-6 w-full flex flex-col gap-4">
            {children}
          </div>
        </div>
      </div>
    </ClientAuthProvider>
  );
}
