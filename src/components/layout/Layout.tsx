import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppFlotante } from "@/components/shared/WhatsAppFlotante";
import { BarraProgreso } from "@/components/shared/BarraProgreso";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <BarraProgreso />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFlotante />
    </div>
  );
}
