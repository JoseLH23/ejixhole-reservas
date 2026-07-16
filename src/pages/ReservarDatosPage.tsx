import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Loader2,
  Mail,
  MessageSquare,
  Pencil,
  Phone,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";

import { useReserva } from "@/context/ReservaContext";
import { publicoApi } from "@/api/publico";
import { generarIdempotencyKey } from "@/lib/idempotencyKey";
import { construirPayloadReserva, crearControlIdempotencia } from "@/lib/reservaPayload";
import { WizardSteps } from "@/components/reservar/WizardSteps";

const schema = z.object({
  nombreCompleto: z.string().min(1),
  email: z.string().min(1).email(),
  telefono: z.string().min(1),
  notas: z.string().optional(),
  quiereCombi: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

function extraerMensajeError(err: unknown, fallback: string): string {
  const detalle = (err as { response?: { data?: { detail?: unknown } } })?.response?.data?.detail;
  if (typeof detalle === "string") return detalle;
  return fallback;
}

function formatearFecha(fecha: string, idioma: string) {
  return new Intl.DateTimeFormat(idioma, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${fecha}T00:00:00`));
}

export function ReservarDatosPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { estado, actualizar, reiniciar } = useReserva();
  const [enviando, setEnviando] = React.useState(false);
  const [errorEnvio, setErrorEnvio] = React.useState<string | null>(null);
  const errorEnvioRef = React.useRef<HTMLDivElement>(null);
  const idempotenciaRef = React.useRef(crearControlIdempotencia(generarIdempotencyKey));

  const {
    register,
    handleSubmit,
    watch,
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

  const quiereCombi = watch("quiereCombi");
  React.useEffect(() => {
    actualizar({ quiereCombi });
  }, [quiereCombi, actualizar]);

  React.useEffect(() => {
    if (!estado.tipoReservacion || !estado.fechaLlegada || !estado.fechaSalida) {
      navigate("/reservar", { replace: true });
    }
  }, [estado.tipoReservacion, estado.fechaLlegada, estado.fechaSalida, navigate]);

  React.useEffect(() => {
    if (errorEnvio) errorEnvioRef.current?.focus();
  }, [errorEnvio]);

  const onSubmit = async (valores: FormValues) => {
    if (!estado.tipoReservacion || !estado.fechaLlegada || !estado.fechaSalida) return;

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setErrorEnvio(t("reservar.sinConexion"));
      return;
    }

    setEnviando(true);
    setErrorEnvio(null);

    try {
      const payload = construirPayloadReserva(estado, valores);
      const respuesta = await publicoApi.crearReservacion(payload, idempotenciaRef.current.actual());

      reiniciar();
      idempotenciaRef.current.confirmarExito();
      navigate("/reservar/confirmacion", { state: { respuesta } });
    } catch (err: unknown) {
      // La clave no cambia: un timeout puede haber guardado la reservación.
      // El reintento recuperará el mismo resultado en vez de duplicarlo.
      setErrorEnvio(extraerMensajeError(err, t("errores.generico")));
    } finally {
      setEnviando(false);
    }
  };

  const fechas = estado.fechaLlegada
    ? estado.fechaLlegada === estado.fechaSalida
      ? formatearFecha(estado.fechaLlegada, i18n.language)
      : `${formatearFecha(estado.fechaLlegada, i18n.language)} → ${formatearFecha(
          estado.fechaSalida!,
          i18n.language
        )}`
    : "—";

  return (
    <div>
      <div className="bg-gradient-to-r from-primary to-secondary py-8 text-center text-primary-foreground">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">{t("hero.titulo")}</h1>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
        <WizardSteps pasoActual={2} />

        <div className="mt-8">
          <h2 className="font-display text-2xl font-semibold text-foreground">
            {t("reservar.datosTitulo")}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {t("reservar.datosDescripcion")}
          </p>
        </div>

        <section className="mt-5 rounded-xl border border-primary/15 bg-primary/[0.03] p-4" aria-labelledby="resumen-solicitud">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p id="resumen-solicitud" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("reservar.resumenSolicitud")}
              </p>
              <p className="mt-1 font-semibold text-foreground">
                {estado.tipoReservacion ? t(`reservar.tipo.${estado.tipoReservacion}`) : "—"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/reservar")}
              disabled={enviando}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground disabled:opacity-50"
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              {t("reservar.editarSeleccion")}
            </button>
          </div>

          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div className="flex items-start gap-2">
              <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <p className="text-xs text-muted-foreground">{t("reservar.fechasSeleccionadas")}</p>
                <p className="font-medium text-foreground">{fechas}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Users className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <p className="text-xs text-muted-foreground">{t("reservar.numPersonas")}</p>
                <p className="font-medium text-foreground">{estado.numPersonas}</p>
              </div>
            </div>
          </div>
        </section>

        <form
          className="mt-6 space-y-5"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          aria-busy={enviando}
        >
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
              <User className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
              {t("reservar.nombreCompleto")}
            </label>
            <input
              {...register("nombreCompleto")}
              autoComplete="name"
              aria-invalid={Boolean(errors.nombreCompleto)}
              className="w-full rounded-lg border border-border px-3 py-3 text-base transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm"
            />
            {errors.nombreCompleto && <p className="mt-1 text-xs text-destructive">{t("errores.campoRequerido")}</p>}
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
              {t("reservar.email")}
            </label>
            <input
              type="email"
              {...register("email")}
              autoComplete="email"
              inputMode="email"
              aria-invalid={Boolean(errors.email)}
              className="w-full rounded-lg border border-border px-3 py-3 text-base transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm"
            />
            {errors.email && <p className="mt-1 text-xs text-destructive">{t("errores.emailInvalido")}</p>}
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
              {t("reservar.telefono")}
            </label>
            <input
              {...register("telefono")}
              autoComplete="tel"
              inputMode="tel"
              aria-invalid={Boolean(errors.telefono)}
              className="w-full rounded-lg border border-border px-3 py-3 text-base transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm"
            />
            {errors.telefono && <p className="mt-1 text-xs text-destructive">{t("errores.campoRequerido")}</p>}
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-foreground">
              <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
              {t("reservar.notas")}
            </label>
            <textarea
              {...register("notas")}
              rows={3}
              className="w-full rounded-lg border border-border px-3 py-3 text-base transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:text-sm"
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

          <div className="flex items-start gap-2 rounded-lg bg-muted/60 p-3 text-xs leading-relaxed text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <p>{t("reservar.datosProtegidos")}</p>
          </div>

          {errorEnvio && (
            <div
              ref={errorEnvioRef}
              role="alert"
              tabIndex={-1}
              className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 outline-none focus:ring-2 focus:ring-destructive/30"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-foreground">{t("reservar.errorEnvioTitulo")}</p>
                  <p className="mt-1 text-sm text-destructive">{errorEnvio}</p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {t("reservar.errorEnvioDescripcion")}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/reservar")}
              disabled={enviando}
              className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-medium text-foreground disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              {t("reservar.atras")}
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-md disabled:opacity-60"
            >
              {enviando ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  {t("reservar.enviando")}
                </>
              ) : (
                <>
                  {errorEnvio ? t("reservar.reintentarEnvio") : t("reservar.enviarSolicitud")}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </button>
          </div>

          {enviando && (
            <p className="text-center text-xs text-muted-foreground" role="status">
              {t("reservar.enviandoAyuda")}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
