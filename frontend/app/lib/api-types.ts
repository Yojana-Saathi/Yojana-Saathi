/**
 * Exact enum values from the backend API contract (Backend/models/enums.py).
 * Using these instead of display labels ensures POST /api/intake never returns 422.
 */

export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
] as const;

export const OCCUPATION_OPTIONS = [
  { value: "farmer", label: "Farmer" },
  { value: "daily_wage", label: "Daily Wage Worker" },
  { value: "student", label: "Student" },
  { value: "self_employed", label: "Self Employed" },
  { value: "salaried", label: "Salaried" },
  { value: "unemployed", label: "Unemployed" },
  { value: "other", label: "Other" },
] as const;

export const SOCIAL_CATEGORY_OPTIONS = [
  { value: "general", label: "General" },
  { value: "obc", label: "OBC" },
  { value: "sc", label: "SC" },
  { value: "st", label: "ST" },
  { value: "ews", label: "EWS" },
] as const;

export const DISABILITY_STATUS_OPTIONS = [
  { value: "none", label: "None" },
  { value: "physical", label: "Physical" },
  { value: "visual", label: "Visual" },
  { value: "hearing", label: "Hearing" },
  { value: "intellectual", label: "Intellectual" },
  { value: "multiple", label: "Multiple" },
] as const;

export const EDUCATION_LEVEL_OPTIONS = [
  { value: "none", label: "No Formal Education" },
  { value: "primary", label: "Primary (up to 5th)" },
  { value: "secondary", label: "Secondary (10th Pass)" },
  { value: "higher_secondary", label: "Higher Secondary (12th Pass)" },
  { value: "graduate", label: "Graduate" },
  { value: "postgraduate", label: "Postgraduate" },
] as const;

export const SCHEME_CATEGORY_OPTIONS = [
  { value: "education", label: "Education" },
  { value: "health", label: "Healthcare" },
  { value: "agriculture", label: "Agriculture" },
  { value: "disability", label: "Disability" },
  { value: "women_child", label: "Women & Child" },
  { value: "housing", label: "Housing" },
  { value: "pension", label: "Pension / Social Welfare" },
  { value: "other", label: "Other" },
] as const;

/**
 * The only 4 document keys accepted by GovIdAvailable in the backend.
 * Adding extra keys will cause a 422 (extra="forbid").
 */
export const GOV_ID_KEYS = [
  "aadhaar",
  "income_certificate",
  "caste_certificate",
  "ration_card",
] as const;

export type GovIdKey = typeof GOV_ID_KEYS[number];

export const GOV_ID_LABELS: Record<GovIdKey, { label: string; icon: string }> = {
  aadhaar: { label: "Aadhaar Card", icon: "🪪" },
  income_certificate: { label: "Income Certificate", icon: "📄" },
  caste_certificate: { label: "Caste Certificate", icon: "📋" },
  ration_card: { label: "Ration Card (BPL)", icon: "🧾" },
};

/** CitizenProfile shape exactly matching POST /api/intake request body */
export type CitizenProfile = {
  full_name: string;
  age: number;
  gender: "male" | "female" | "other";
  state: string;
  district: string;
  annual_income: number;
  occupation: "farmer" | "daily_wage" | "student" | "self_employed" | "salaried" | "unemployed" | "other";
  social_category: "general" | "obc" | "sc" | "st" | "ews";
  disability_status: "none" | "physical" | "visual" | "hearing" | "intellectual" | "multiple";
  family_size: number;
  has_bpl_card: boolean;
  land_owned_acres: number;
  education_level: "none" | "primary" | "secondary" | "higher_secondary" | "graduate" | "postgraduate";
  gov_id_available: Record<GovIdKey, boolean>;
};

/** IntakeResponse from POST /api/intake */
export type SchemeResult = {
  scheme_id: string;
  scheme_name: string;
  scheme_category: string;
  benefit_summary: string;
  benefit_value_estimate: string;
  eligibility_match_score: number;
  priority_rank: number;
  missing_documents: GovIdKey[];
  application_url: string;
  drafted_application_text: string | null;
};

export type IntakeResponse = {
  request_id: string;
  eligible_schemes: SchemeResult[];
  total_eligible_count: number;
  processing_status: "success" | "partial_success" | "error";
  error_message: string | null;
};

/** DraftResponse from GET /api/draft/{scheme_id}?request_id=... */
export type DraftResponse = {
  scheme_id: string;
  drafted_application_text: string;
  required_documents: GovIdKey[];
  next_steps: string[];
};
