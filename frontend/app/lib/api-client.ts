import type { CitizenProfile, IntakeResponse, DraftResponse } from "./api-types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/**
 * POST /api/intake
 * Submit a CitizenProfile; get ranked eligible schemes.
 */
export async function submitIntake(profile: CitizenProfile): Promise<IntakeResponse> {
  const res = await fetch(`${BASE_URL}/api/intake`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err?.error_message ?? `Intake failed with status ${res.status}`
    );
  }

  return res.json() as Promise<IntakeResponse>;
}

/**
 * GET /api/draft/{scheme_id}?request_id=...
 * Generate a pre-filled application draft for one scheme.
 * Must be called after submitIntake() using the returned request_id.
 */
export async function fetchDraft(
  schemeId: string,
  requestId: string
): Promise<DraftResponse> {
  const url = new URL(`${BASE_URL}/api/draft/${encodeURIComponent(schemeId)}`);
  url.searchParams.set("request_id", requestId);

  const res = await fetch(url.toString());

  if (res.status === 404) {
    throw new Error(
      "Draft not found — the session may have expired (30 min TTL). Please re-run the eligibility check."
    );
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err?.error_message ?? `Draft failed with status ${res.status}`
    );
  }

  return res.json() as Promise<DraftResponse>;
}

/**
 * GET /api/health
 * Liveness probe.
 */
export async function checkHealth(): Promise<{ status: string; agents_online: string[] }> {
  const res = await fetch(`${BASE_URL}/api/health`);
  if (!res.ok) throw new Error("Backend health check failed");
  return res.json();
}
