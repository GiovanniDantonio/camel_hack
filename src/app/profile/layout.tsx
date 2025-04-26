import { ClientAuthProvider } from '@/components/auth-provider';
import { NavBar } from '@/components/nav-bar';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientAuthProvider>
      <div className="flex min-h-screen flex-col">
        <NavBar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </ClientAuthProvider>
  );
}
