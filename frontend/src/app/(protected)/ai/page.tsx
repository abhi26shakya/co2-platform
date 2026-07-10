"use client";

import { Card } from "@/components/ui/card";
import { useSystemStatus } from "@/features/dashboard/hooks/use-system-status";
import { useModels } from "@/features/reports/hooks/use-reports";
import { cn } from "@/lib/utils";
import type { MLModelOut } from "@/types/report";

function Metric({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="rounded-lg border border-ground-700 bg-ground-900/40 p-4">
      <p className="text-xs text-ground-400">{label}</p>
      <p className="readout mt-1 text-xl">
        {value != null ? value.toFixed(3) : "—"}
      </p>
    </div>
  );
}

function ModelHistoryRow({ model }: { model: MLModelOut }) {
  return (
    <li className="flex items-center justify-between gap-4 py-3 text-sm">
      <div className="min-w-0">
        <p className="truncate">
          {model.name}{" "}
          <span className="readout text-xs text-ground-400">{model.version}</span>
        </p>
        <p className="mt-0.5 text-xs text-ground-400">
          {model.architecture ?? "architecture n/a"} · registered{" "}
          {new Date(model.created_at).toLocaleDateString()}
        </p>
      </div>
      {model.is_active && (
        <span className="readout shrink-0 rounded-full border border-sensor/40 bg-sensor/10 px-2.5 py-1 text-xs text-sensor">
          active
        </span>
      )}
    </li>
  );
}

export default function ModelPage() {
  const { data: models, isLoading } = useModels();
  const { data: system } = useSystemStatus();

  const active = models?.find((m: MLModelOut) => m.is_active) ?? models?.[0];
  const isMock = active?.version.startsWith("mock");
  const mlOnline = system?.ml_service === "ok";

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-medium" style={{ fontFamily: "var(--font-display)" }}>
        Model
      </h1>
      <p className="mt-1 text-sm text-ground-400">
        The inference model currently serving predictions, and the registry history.
      </p>

      {isLoading ? (
        <Card className="mt-8 p-6">
          <p className="text-sm text-ground-400">Loading model registry…</p>
        </Card>
      ) : active ? (
        <>
          <Card className="mt-8 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-medium">{active.name}</h2>
                <p className="readout mt-1 text-sm text-ground-400">
                  {active.version} · {active.architecture ?? "architecture n/a"}
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-ground-700 bg-ground-900/70 px-3 py-1.5 text-xs">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    mlOnline ? "bg-sensor" : "bg-alert"
                  )}
                />
                <span className="readout">
                  {mlOnline ? "inference service online" : "inference service unreachable"}
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Metric label="Accuracy" value={active.accuracy} />
              <Metric label="Precision" value={active.precision_score} />
              <Metric label="Recall" value={active.recall} />
              <Metric label="F1 score" value={active.f1_score} />
            </div>

            <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-sm">
              <div className="flex items-baseline gap-2">
                <dt className="text-ground-400">Last trained</dt>
                <dd className="readout">
                  {active.trained_at
                    ? new Date(active.trained_at).toLocaleDateString()
                    : "never"}
                </dd>
              </div>
              <div className="flex items-baseline gap-2">
                <dt className="text-ground-400">Registered</dt>
                <dd className="readout">
                  {new Date(active.created_at).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </Card>

          {isMock && (
            <Card className="mt-4 border-dashed p-5">
              <h3 className="text-sm font-medium">Awaiting the real model</h3>
              <p className="mt-2 text-sm leading-relaxed text-ground-400">
                Predictions currently come from the placeholder inference service.
                When the trained CNN/U-Net is integrated (see{" "}
                <span className="readout text-xs">docs/ml-integration.md</span>),
                register it with its evaluation metrics and mark it active — this
                page and every new prediction will pick it up automatically.
              </p>
            </Card>
          )}

          {models && models.length > 1 && (
            <Card className="mt-4 px-5">
              <h3 className="pt-4 text-sm font-medium">Registry history</h3>
              <ul className="divide-y divide-ground-700">
                {models.map((m: MLModelOut) => (
                  <ModelHistoryRow key={m.id} model={m} />
                ))}
              </ul>
            </Card>
          )}
        </>
      ) : (
        <Card className="mt-8 p-6">
          <p className="text-sm text-ground-400">
            No models registered. Run the seed script to register the placeholder,
            or add your trained model to the registry.
          </p>
        </Card>
      )}
    </div>
  );
}
