import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Layout } from "@/components/layout/Layout";
import { ReservaProvider } from "@/context/ReservaContext";
import { InicioPage } from "@/pages/InicioPage";
import { ReservarTipoFechasPage } from "@/pages/ReservarTipoFechasPage";
import { ReservarDatosPage } from "@/pages/ReservarDatosPage";
import { ConfirmacionPage } from "@/pages/ConfirmacionPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <ReservaProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<InicioPage />} />
            <Route path="/reservar" element={<ReservarTipoFechasPage />} />
            <Route path="/reservar/datos" element={<ReservarDatosPage />} />
            <Route path="/reservar/confirmacion" element={<ConfirmacionPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </ReservaProvider>
    </BrowserRouter>
  );
}
