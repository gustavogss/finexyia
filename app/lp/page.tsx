import { TopAppBar } from "@/components/navigation";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      
      <TopAppBar disableNotifications />

      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold">Bem-vindo ao FINANCY</h1>
        <p className="text-lg text-secondary">
          Organize sua vida financeira de forma simples e eficiente.
        </p>
      </main>

      <footer className="text-center text-xs p-4 text-secondary">
        © 2026 FINANCY
      </footer>
    </div>
  );
}