const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchApi<T>(
  path: string,
  options?: RequestInit & { token?: string }
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };
  if (options?.token) {
    headers["Authorization"] = `Bearer ${options.token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }

  return res.json();
}

// --- Auth ---

export type LoginPayload = { email: string; password: string };
export type SignupPayload = { email: string; password: string; full_name: string };

// --- Profile / Intake ---

export type CitizenProfile = {
  full_name: string;
  age: number;
  gender: "male" | "female" | "transgender";
  state: string;
  district: string;
  annual_income: number;
  occupation: string;
  social_category: "general" | "obc" | "sc" | "st" | "ews";
  disability_status: "none" | "physical" | "visual" | "hearing" | "multiple";
  family_size: number;
  has_bpl_card: boolean;
  land_owned_acres: number;
  education_level: string;
};

export type IntakeResponse = {
  request_id: string;
  ranked_schemes: Array<{
    scheme_id: string;
    scheme_name: string;
    scheme_category: string;
    issuing_authority: string;
    match_score: number;
    benefit_summary: string;
    benefit_value_estimate: string;
    missing_documents: string[];
    priority_rank: number;
    application_url: string;
  }>;
  missing_documents_summary: string[];
  processing_time_ms: number;
};

export async function submitIntake(token: string, profile: CitizenProfile) {
  return fetchApi<IntakeResponse>("/api/intake", {
    method: "POST",
    body: JSON.stringify(profile),
    token,
  });
}

// --- Schemes ---

export type Scheme = {
  id: string;
  scheme_id: string;
  scheme_name: string;
  scheme_category: string;
  issuing_authority: string;
  benefit_summary: string;
  benefit_value_estimate: string;
  application_url: string;
  required_documents: string[];
  is_active: boolean;
  eligibility_rules: Record<string, unknown>;
};

function rawSchemeToScheme(s: Record<string, unknown>): Scheme {
  return {
    id: (s.scheme_id as string) || (s.id as string) || "",
    scheme_id: (s.scheme_id as string) || (s.id as string) || "",
    scheme_name: (s.scheme_name as string) || "",
    scheme_category: (s.scheme_category as string) || "",
    issuing_authority: (s.issuing_authority as string) || "",
    benefit_summary: (s.benefit_summary as string) || "",
    benefit_value_estimate: (s.benefit_value_estimate as string) || "",
    application_url: (s.application_url as string) || "",
    required_documents: (s.required_documents as string[]) || [],
    is_active: (s.is_active as boolean) ?? true,
    eligibility_rules: (s.eligibility_rules as Record<string, unknown>) || {},
  };
}

function filterSchemes(schemes: Scheme[], query?: string): Scheme[] {
  if (!query) return schemes;
  const q = query.toLowerCase();
  return schemes.filter(
    (s) =>
      s.scheme_name.toLowerCase().includes(q) ||
      s.benefit_summary.toLowerCase().includes(q) ||
      s.scheme_category.toLowerCase().includes(q) ||
      s.issuing_authority.toLowerCase().includes(q)
  );
}

export async function searchSchemes(query?: string): Promise<Scheme[]> {
  // 1. Backend API
  try {
    const qs = query ? `?q=${encodeURIComponent(query)}` : "";
    return await fetchApi<Scheme[]>(`/api/schemes/search${qs}`);
  } catch { /* fall through */ }

  // 2. Supabase
  try {
    const { supabase: sb } = await import("@/lib/supabase");
    if (!sb) throw new Error("Supabase not configured");
    let q = sb.from("schemes").select("*").eq("is_active", true);
    if (query) {
      q = q.textSearch("scheme_name", query, { type: "plain" });
    }
    const { data, error } = await q.order("scheme_name");
    if (error) throw error;
    return (data || []).map(rawSchemeToScheme);
  } catch { /* fall through */ }

  // 3. Local schemes.json (works offline, no backend needed)
  try {
    const res = await fetch("/schemes.json");
    if (!res.ok) throw new Error("Failed to fetch schemes.json");
    const raw = await res.json() as Record<string, unknown>[];
    const all = raw.map(rawSchemeToScheme).filter((s) => s.is_active);
    return filterSchemes(all, query);
  } catch {
    return [];
  }
}

// --- Documents ---

export type UserDocument = {
  id: string;
  doc_type: string;
  storage_path: string;
  verification_status: "pending" | "verified" | "rejected";
  extracted_data?: Record<string, string>;
  extraction_confidence?: number;
  uploaded_at: string;
};

export async function uploadDocument(token: string, file: File, docType: string) {
  const form = new FormData();
  form.append("file", file);
  form.append("doc_type", docType);

  const headers: Record<string, string> = {};
  headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/api/documents/upload`, {
    method: "POST",
    headers,
    body: form,
  });
  if (!res.ok) throw new Error(`Upload failed: ${await res.text()}`);
  return res.json();
}

export async function listDocuments(token: string): Promise<UserDocument[]> {
  try {
    return await fetchApi<UserDocument[]>("/api/documents", { token });
  } catch {
    try {
      const { supabase: sb } = await import("@/lib/supabase");
      if (!sb) throw new Error("Supabase not configured");
      const { data, error } = await sb
        .from("documents")
        .select("*")
        .order("uploaded_at", { ascending: false });
      if (error) throw error;
      return (data || []).map((d: Record<string, unknown>) => ({
        id: d.id as string,
        doc_type: d.doc_type as string,
        storage_path: d.storage_path as string,
        verification_status: (d.verification_status as UserDocument["verification_status"]) || "pending",
        extracted_data: d.extracted_data as Record<string, string> | undefined,
        extraction_confidence: d.extraction_confidence as number | undefined,
        uploaded_at: d.uploaded_at as string,
      }));
    } catch {
      return [];
    }
  }
}

export async function confirmDocument(token: string, docId: string) {
  return fetchApi<{ status: string }>(`/api/documents/${docId}/confirm`, {
    method: "POST",
    token,
  });
}

// --- Notifications ---

export type Notification = {
  id: string;
  type: "new_match" | "doc_missing_reminder" | "scheme_updated";
  payload: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
};

export async function listNotifications(token: string): Promise<Notification[]> {
  try {
    return await fetchApi<Notification[]>("/api/notifications", { token });
  } catch {
    try {
      const { supabase: sb } = await import("@/lib/supabase");
      if (!sb) throw new Error("Supabase not configured");
      const { data, error } = await sb
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map((n: Record<string, unknown>) => ({
        id: n.id as string,
        type: n.type as Notification["type"],
        payload: n.payload as Record<string, unknown>,
        read_at: n.read_at as string | null,
        created_at: n.created_at as string,
      }));
    } catch {
      return [];
    }
  }
}

export async function markNotificationRead(token: string, id: string) {
  return fetchApi<{ status: string }>(`/api/notifications/${id}/read`, {
    method: "POST",
    token,
  });
}

// --- Eligibility Matches (Dashboard) ---

export type EligibilityMatch = {
  id: string;
  scheme_id: string;
  scheme_name: string;
  scheme_category: string;
  issuing_authority: string;
  match_score: number;
  benefit_summary: string;
  benefit_value_estimate: string;
  missing_documents: string[];
  priority_rank: number;
  application_url: string;
  matched_at: string;
  application_status?: "matched" | "drafted" | "applied" | "approved" | "rejected";
};

export async function getUserMatches(token: string): Promise<EligibilityMatch[]> {
  // Try the backend API first
  try {
    const res = await fetch(`${API_URL}/api/matches`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.ranked_schemes) return data.ranked_schemes;
      if (data.eligible_schemes) return data.eligible_schemes;
      if (Array.isArray(data)) return data;
    }
  } catch { /* fall through to Supabase query */ }

  // Fallback: query Supabase eligibility_matches table without inner-join restriction
  try {
    const { supabase: sb } = await import("@/lib/supabase");
    if (!sb) throw new Error("Supabase not configured");
    const { data, error } = await sb
      .from("eligibility_matches")
      .select("*, schemes(*), applications(*)")
      .order("priority_rank", { ascending: true });

    if (error) throw error;

    return (data || []).map((row: Record<string, unknown>) => {
      const scheme = row.schemes as Record<string, unknown> || {};
      const app = (row.applications as Record<string, unknown>[])?.[0];
      return {
        id: row.id as string,
        scheme_id: (scheme.scheme_id as string) || (row.scheme_id as string) || "",
        scheme_name: (scheme.scheme_name as string) || "",
        scheme_category: (scheme.scheme_category as string) || "",
        issuing_authority: (scheme.issuing_authority as string) || "",
        match_score: (row.match_score as number) || 0.0,
        benefit_summary: (scheme.benefit_summary as string) || "",
        benefit_value_estimate: (scheme.benefit_value_estimate as string) || "",
        missing_documents: (row.missing_documents as string[]) || [],
        priority_rank: (row.priority_rank as number) || 1,
        application_url: (scheme.application_url as string) || "",
        matched_at: (row.matched_at as string) || "",
        application_status: (app?.status as EligibilityMatch["application_status"]) || "matched",
      };
    });
  } catch {
    return [];
  }
}

// --- Chat Q&A ---

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ChatResponse = {
  reply: string;
  sources: string[];
};

export async function sendChatMessage(
  message: string,
  history: ChatMessage[] = []
): Promise<ChatResponse> {
  const res = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      history: history.map((m) => ({ role: m.role, content: m.content })),
    }),
  });
  if (!res.ok) {
    throw new Error(`Chat API error: ${res.status}`);
  }
  return res.json();
}
