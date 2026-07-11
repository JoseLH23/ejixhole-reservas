import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, User, Mail, Phone, MessageSquare } from "lucide-react";

import { useReserva } from "@/context/ReservaContext";
import { publicoApi } from "@/api/publico";
import { WizardSteps } from "@/components/reservar/WizardSteps";

const schema = z.object({
  nombreCompleto: z.string().min(1),
  email: z.string().min(1).email(),
  telefono: z.string().min(1),
  notas: z.string().optional(),
  quiereCombi: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export function ReservarDatosPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { estado, actualizar } = useReserva();
  const [enviando, setEnviando] = React.useState(false);
  const [errorEnvio, setErrorEnvio] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombreCompleto: estado.nombreCompleto,
      email: estado.email,
      telefono: estado.telefono,
      notas: estado.notas,
      quiereCombi: estado.quiereCombi,
    },
  });

  // Si alguien llega aquí directo (sin pasar por el paso 1), lo regresamos.
  React.useEffect(() => {
    if (!estado.tipoReservacion || !estado.fechaLlegada || !estado.fechaSalida) {
      navigate("/reservar", { replace: true });
    }
  }, [estado.tipoReservacion, estado.fechaLlegada, estado.fechaSalida, navigate]);

  const onSubmit = async (valores: FormValues) => {
    if (!estado.tipoReservacion || !estado.fechaLlegada || !estado.fechaSalida) return;

    setEnviando(true);
    setErrorEnvio(null);

    const notasFinales = valores.quiereCombi
      ? `${valores.notas ?? ""}\n\n[Solicita información de transporte en combi]`.trim()
      : valores.notas || null;

    try {
      const respuesta = await publicoApi.crearReservacion({
        nombre_completo: valores.nombreCompleto,
        email: valores.email,
        telefono: valores.telefono,
        tipo_reservacion: estado.tipoReservacion,
        fecha_llegada: estado.fechaLlegada,
        fecha_salida: estado.fechaSalida,
        num_personas: estado.numPersonas,
        unidad_hospedaje_id: estado.unidadHospedajeId,
        notas: notasFinales,
      });

      actualizar({
        nombreCompleto: valores.nombreCompleto,
        email: valores.email,
        telefono: valores.telefono,
        notas: valores.notas ?? "",
        quiereCombi: valores.quiereCombi,
      });

      navigate("/reservar/confirmacion", { state: { respuesta } });
    } catch (err: any) {
      setErrorEnvio(err?.response?.data?.detail ?? t("errores.generico"));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-primary to-secondary py-8 text-center text-primary-foreground">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">{t("hero.titulo")}</h1>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <WizardSteps pasoActual={2} />

      <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            {t("reservar.nombreCompleto")}
          </label>
          <input
            {...register("nombreCompleto")}
            className="w-full rounded-lg border border-border px-3 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {errors.nombreCompleto && <p className="mt-1 text-xs text-destructive">{t("errores.campoRequerido")}</p>}
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
            {t("reservar.email")}
          </label>
          <input
            type="email"
            {...register("email")}
            className="w-full rounded-lg border border-border px-3 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {errors.email && <p className="mt-1 text-xs text-destructive">{t("errores.emailInvalido")}</p>}
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
            {t("reservar.telefono")}
          </label>
          <input
            {...register("telefono")}
            className="w-full rounded-lg border border-border px-3 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {errors.telefono && <p className="mt-1 text-xs text-destructive">{t("errores.campoRequerido")}</p>}
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
            <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
            {t("reservar.notas")}
          </label>
          <textarea
            {...register("notas")}
            rows={3}
            className="w-full rounded-lg border border-border px-3 py-2.5 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <label className="flex items-start gap-2.5 text-sm">
            <input type="checkbox" {...register("quiereCombi")} className="mt-0.5 h-4 w-4" />
            <span>
              <span className="font-medium text-foreground">{t("reservar.combi.checkbox")}</span>
              <p className="mt-0.5 text-xs text-muted-foreground">{t("reservar.combi.descripcion")}</p>
            </span>
          </label>
        </div>

        {errorEnvio && <p className="text-sm text-destructive">{errorEnvio}</p>}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate("/reservar")}
            className="flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-medium text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("reservar.atras")}
          </button>
          <button
            type="submit"
            disabled={enviando}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-60"
          >
            {enviando ? t("reservar.enviando") : t("reservar.enviarSolicitud")}
            {!enviando && <ArrowRight className="h-4 w-4" />}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}
