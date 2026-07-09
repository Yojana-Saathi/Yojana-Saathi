import os
import re
import json
import math
import collections
from pathlib import Path
from datasets import load_dataset
import jsonschema

# Setup paths
DATA_DIR = Path(__file__).resolve().parent
SCHEMES_JSON_PATH = DATA_DIR / "schemes.json"
SCHEMA_JSON_PATH = DATA_DIR / "schema.json"
UNVERIFIED_JSON_PATH = DATA_DIR / "unverified_schemes.json"
SCHEMA_DEF_PATH = DATA_DIR / "scheme_schema.json"

TODAY = "2026-07-10"

def clean_str(val, default=""):
    if val is None:
        return default
    if isinstance(val, float):
        if math.isnan(val):
            return default
        s = str(val).strip()
        if s.endswith(".0"):
            s = s[:-2]
        return s
    return str(val).strip()

def load_schema():
    with open(SCHEMA_DEF_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def clean_name(name):
    # Remove extra quotes and whitespace
    name = clean_str(name)
    if not name:
        return ""
    if (name.startswith('"') and name.endswith('"')) or (name.startswith("'") and name.endswith("'")):
        name = name[1:-1].strip()
    return name

def generate_slug(name, slug_candidate=None):
    slug_candidate = clean_str(slug_candidate, None)
    if slug_candidate:
        clean = slug_candidate.lower().strip().replace('_', '-')
        clean = re.sub(r'[^a-z0-9\-]', '', clean)
        clean = re.sub(r'-+', '-', clean).strip('-')
        if re.match(r'^[a-z0-9]+(?:-[a-z0-9]+)*$', clean) and len(clean) > 0:
            return clean
    # Fallback to name
    clean = str(name).lower().strip()
    clean = re.sub(r'[^a-z0-9]', '-', clean)
    clean = re.sub(r'-+', '-', clean).strip('-')
    if not clean:
        clean = "scheme-unknown"
    return clean

def map_category(cat_str, name, desc):
    cat_str = clean_str(cat_str).lower()
    name_l = clean_str(name).lower()
    desc_l = clean_str(desc).lower()
    
    # 1. Pension
    if "pension" in name_l or "pension" in desc_l or "old age" in name_l or "widow" in name_l:
        return "pension"
    
    # 2. Disability
    if "disability" in cat_str or "disabled" in name_l or "disability" in name_l:
        return "disability"
    
    # 3. Agriculture
    if "agriculture" in cat_str or "farming" in cat_str or "farmer" in name_l or "kisan" in name_l or "crop" in name_l or "fishermen" in name_l or "fisheries" in name_l:
        return "agriculture"
        
    # 4. Education
    if "education" in cat_str or "learning" in cat_str or "scholarship" in name_l or "student" in name_l or "school" in name_l:
        return "education"
        
    # 5. Health
    if "health" in cat_str or "wellness" in cat_str or "medical" in name_l or "hospital" in name_l or "insurance" in name_l or "ayushman" in name_l:
        return "health"
        
    # 6. Housing
    if "housing" in cat_str or "shelter" in cat_str or "house" in name_l or "awas" in name_l or "residential" in name_l:
        return "housing"
        
    # 7. Employment
    if "employment" in cat_str or "job" in cat_str or "skills" in cat_str or "wage" in cat_str or "employment" in name_l or "skill" in name_l or "employability" in name_l:
        return "employment"
        
    # 8. Women & Child
    if "women" in cat_str or "child" in cat_str or "girl" in name_l or "maternity" in name_l or "matru" in name_l or "ladli" in name_l:
        return "women_child"
        
    # 9. Financial Inclusion
    if "banking" in cat_str or "financial" in cat_str or "insurance" in cat_str or "loan" in name_l or "subsidy" in name_l or "credit" in name_l:
        return "financial_inclusion"
        
    return "other"

def map_occupations(eligibility_text, desc, name):
    text = f"{eligibility_text} {desc} {name}".lower()
    occupations = []
    if any(k in text for k in ["farmer", "kisan", "cultivator", "landowner", "agricultural"]):
        occupations.append("farmer")
    if any(k in text for k in ["student", "school", "college", "matric", "postgraduate", "undergraduate"]):
        occupations.append("student")
    if any(k in text for k in ["vendor", "artisan", "entrepreneur", "merchant", "business owner", "self-employed", "self employed", "retailer"]):
        occupations.append("self_employed")
    if any(k in text for k in ["laborer", "labourer", "daily wage", "daily-wage", "unskilled", "worker", "mgnrega", "coolie"]):
        occupations.append("daily_wage")
    if any(k in text for k in ["salaried", "employee", "govt service", "government service"]):
        occupations.append("salaried")
    if any(k in text for k in ["unemployed", "job seeker", "seeking job"]):
        occupations.append("unemployed")
    return occupations

def map_social_categories(caste_str, eligibility_text):
    categories = set()
    caste_str = clean_str(caste_str)
    if caste_str:
        try:
            caste_list = json.loads(caste_str)
            for caste in caste_list:
                caste_l = caste.lower().strip()
                if caste_l in ["general", "gen"]:
                    categories.add("general")
                elif caste_l in ["sc"]:
                    categories.add("sc")
                elif caste_l in ["st"]:
                    categories.add("st")
                elif caste_l in ["obc"]:
                    categories.add("obc")
                elif caste_l in ["ews"]:
                    categories.add("ews")
        except:
            pass
    
    text = clean_str(eligibility_text).lower()
    if "ews" in text or "economically weaker" in text:
        categories.add("ews")
        
    return sorted(list(categories))

def map_disability_status(has_disability, eligibility_text, desc):
    if not has_disability:
        return []
    
    text = f"{eligibility_text} {desc}".lower()
    status = []
    if "visual" in text or "blind" in text or "vision" in text:
        status.append("visual")
    if "hearing" in text or "deaf" in text:
        status.append("hearing")
    if "intellectual" in text or "mental" in text or "cognitive" in text:
        status.append("intellectual")
    if "multiple" in text:
        status.append("multiple")
    if "physical" in text or "locomotor" in text or "orthopedic" in text or "handicapped" in text or "disabled" in text:
        status.append("physical")
        
    if not status:
        return ["physical", "visual", "hearing", "intellectual", "multiple"]
        
    return sorted(status)

def map_states(state_val, eligibility_state_str):
    states = set()
    state_val = clean_str(state_val)
    if state_val and state_val.lower() != 'central':
        states.add(state_val)
    
    eligibility_state_str = clean_str(eligibility_state_str)
    if eligibility_state_str:
        try:
            state_list = json.loads(eligibility_state_str)
            for s in state_list:
                s_clean = clean_str(s)
                if s_clean and s_clean.lower() != 'central':
                    states.add(s_clean)
        except:
            pass
    return sorted(list(states))

def map_documents(docs_required_str, eligibility_text):
    text = f"{docs_required_str} {eligibility_text}".lower()
    docs = set()
    if "aadhaar" in text or "aadhar" in text:
        docs.add("aadhaar")
    if "income certificate" in text or "income proof" in text:
        docs.add("income_certificate")
    if "caste certificate" in text or "community certificate" in text:
        docs.add("caste_certificate")
    if "ration card" in text or "bpl card" in text:
        docs.add("ration_card")
    if "domicile" in text or "residence certificate" in text or "residential certificate" in text or "nativity" in text or "resident proof" in text:
        docs.add("domicile_certificate")
    if "disability certificate" in text or "certificate of disability" in text:
        docs.add("disability_certificate")
    if "land record" in text or "patta" in text or "ror" in text or "land holding" in text:
        docs.add("land_record")
    if "bank passbook" in text or "bank account" in text or "bank details" in text or "bank statement" in text:
        docs.add("bank_passbook")
    if "voter id" in text or "epic" in text:
        docs.add("voter_id")
    if any(k in text for k in ["marksheet", "marks sheet", "educational certificate", "degree certificate", "passing certificate", "matriculation certificate", "ssc certificate"]):
        docs.add("education_marksheet")
        
    return sorted(list(docs))

def extract_benefit_value_estimate(benefits):
    benefits_clean = clean_str(benefits).replace('\n', ' ').strip()
    if not benefits_clean:
        return "Not specified"
    match = re.search(r'(?:₹|Rs\.?)\s?\d+(?:,\d+)*(?:\s?(?:per year|year|annum|month|one-time|lakh))?', benefits_clean, re.IGNORECASE)
    if match:
        return match.group(0).strip()
    words = benefits_clean.split()
    if len(words) > 6:
        return " ".join(words[:6]) + "..."
    return benefits_clean

def get_benefit_summary(desc, name):
    desc_clean = clean_str(desc)
    if not desc_clean:
        return f"Welfare scheme providing benefits under {name}."
    sentences = re.split(r'(?<=[.!?])\s+', desc_clean)
    summary = " ".join(sentences[:2])
    if len(summary) > 200:
        summary = summary[:197] + "..."
    return summary

def cast_age(val):
    if val is None:
        return None
    try:
        fval = float(val)
        if math.isnan(fval):
            return None
        return int(fval)
    except:
        return None

def cast_income(val):
    if val is None:
        return None
    try:
        fval = float(val)
        if math.isnan(fval):
            return None
        return fval
    except:
        return None

def main():
    print("Step 1: Load and map existing verified seed schemes...")
    if not SCHEMES_JSON_PATH.exists():
        print(f"Error: {SCHEMES_JSON_PATH} not found.")
        return
        
    with open(SCHEMES_JSON_PATH, "r", encoding="utf-8") as f:
        seed_schemes_raw = json.load(f)
        
    verified_schemes = []
    seen_normalized_names = set()
    
    for scheme in seed_schemes_raw:
        # Build normalized name for deduplication
        norm_name = re.sub(r'[^a-z0-9]', '', scheme["scheme_name"].lower())
        seen_normalized_names.add(norm_name)
        
        # Map seed schemes to the new format
        mapped_seed = {
            "scheme_id": scheme["scheme_id"],
            "scheme_name": scheme["scheme_name"],
            "scheme_category": scheme["scheme_category"],
            "issuing_authority": scheme["issuing_authority"],
            "eligibility_rules": {
                "min_age": scheme["eligibility_rules"].get("min_age"),
                "max_age": scheme["eligibility_rules"].get("max_age"),
                "max_annual_income": scheme["eligibility_rules"].get("max_annual_income"),
                "allowed_occupations": scheme["eligibility_rules"].get("allowed_occupations", []),
                "allowed_social_categories": scheme["eligibility_rules"].get("allowed_social_categories", []),
                "required_disability_status": scheme["eligibility_rules"].get("required_disability_status", []),
                "state_restricted_to": scheme["eligibility_rules"].get("state_restricted_to", []),
                "gender_restricted_to": scheme["eligibility_rules"].get("gender_restricted_to", "any")
            },
            "eligibility_text_raw": "Manually verified seed scheme.",
            "benefit_summary": scheme["benefit_summary"],
            "benefit_value_estimate": scheme["benefit_value_estimate"],
            "required_documents": scheme.get("required_documents", []),
            "application_url": scheme["application_url"],
            "official_source_url": scheme["application_url"],
            "last_verified_date": TODAY,
            "eligibility_verified": True
        }
        verified_schemes.append(mapped_seed)
        
    print(f"Loaded {len(verified_schemes)} verified seed schemes.")
    
    print("\nStep 2: Download the Hugging Face dataset...")
    try:
        ds = load_dataset("smartduketech/indian-government-schemes-2025")
        df = ds['train'].to_pandas()
        print(f"Downloaded {len(df)} records from Hugging Face dataset.")
    except Exception as e:
        print(f"Error downloading Hugging Face dataset: {e}")
        return
        
    print("\nStep 3: Process and map the new schemes...")
    unverified_schemes = []
    ambiguous_schemes = []
    
    # Track duplicates
    duplicate_count = 0
    
    for idx, row in df.iterrows():
        name = clean_name(row.get("name"))
        if not name:
            continue
            
        norm_name = re.sub(r'[^a-z0-9]', '', name.lower())
        
        # Deduplicate against seed schemes and already processed new schemes
        if norm_name in seen_normalized_names:
            duplicate_count += 1
            continue
            
        seen_normalized_names.add(norm_name)
        
        # Extract fields securely using clean_str
        desc = clean_str(row.get("description"))
        category_str = clean_str(row.get("category"))
        eligibility_text = clean_str(row.get("eligibility_text"))
        
        # Check if eligibility text is too ambiguous to map
        is_ambiguous = False
        if not eligibility_text or len(eligibility_text) < 10:
            is_ambiguous = True
            
        # Parse fields
        scheme_id = generate_slug(name, row.get("slug"))
        category = map_category(category_str, name, desc)
        
        # Map issuing authority
        dept = clean_str(row.get("department"))
        ministry = clean_str(row.get("ministry"))
        state = clean_str(row.get("state"))
        authority = ""
        if dept:
            authority = dept
        if ministry:
            authority = f"{ministry} - {authority}" if authority else ministry
        if not authority:
            authority = f"Government of {state}" if state and state.lower() != 'central' else "Government of India"
            
        # Parse eligibility rules
        min_age = cast_age(row.get("eligibility_age_min"))
        max_age = cast_age(row.get("eligibility_age_max"))
        max_income = cast_income(row.get("eligibility_income_max"))
        
        gender = clean_str(row.get("eligibility_gender")).lower()
        if gender == "all" or not gender:
            gender = "any"
        elif gender not in ["male", "female"]:
            gender = "any"
            
        occupations = map_occupations(eligibility_text, desc, name)
        social_categories = map_social_categories(row.get("eligibility_caste"), eligibility_text)
        disability_status = map_disability_status(row.get("eligibility_disability"), eligibility_text, desc)
        states_restricted = map_states(state, row.get("eligibility_state"))
        
        # Required documents
        docs = map_documents(clean_str(row.get("documents_required")), eligibility_text)
        
        # Benefit summary and value
        benefit_summary = get_benefit_summary(desc, name)
        benefit_value = extract_benefit_value_estimate(row.get("benefits"))
        
        # application and official URLs
        apply_url = clean_str(row.get("apply_url"))
        official_url = clean_str(row.get("official_url"))
        if not apply_url:
            apply_url = official_url if official_url else "https://www.myscheme.gov.in"
            
        mapped_scheme = {
            "scheme_id": scheme_id,
            "scheme_name": name,
            "scheme_category": category,
            "issuing_authority": authority,
            "eligibility_rules": {
                "min_age": min_age,
                "max_age": max_age,
                "max_annual_income": max_income,
                "allowed_occupations": occupations,
                "allowed_social_categories": social_categories,
                "required_disability_status": disability_status,
                "state_restricted_to": states_restricted,
                "gender_restricted_to": gender
            },
            "eligibility_text_raw": eligibility_text if eligibility_text else "Not specified",
            "benefit_summary": benefit_summary,
            "benefit_value_estimate": benefit_value,
            "required_documents": docs,
            "application_url": apply_url,
            "official_source_url": official_url if official_url else "https://www.myscheme.gov.in",
            "last_verified_date": TODAY,
            "eligibility_verified": False
        }
        
        unverified_schemes.append(mapped_scheme)
        if is_ambiguous:
            ambiguous_schemes.append(name)
            
    print(f"Processed new schemes. Deduplicated: {duplicate_count}. Unverified schemes count: {len(unverified_schemes)}.")
    
    print("\nStep 4: Load JSON schema and validate all outputs...")
    schema = load_schema()
    
    # Validate verified schemes
    print("Validating verified schemes...")
    for idx, s in enumerate(verified_schemes):
        try:
            jsonschema.validate(instance=s, schema=schema)
        except jsonschema.ValidationError as e:
            print(f"Validation error in verified schemes at index {idx} ({s['scheme_id']}): {e.message}")
            return
            
    # Validate unverified schemes
    print("Validating unverified schemes...")
    for idx, s in enumerate(unverified_schemes):
        try:
            jsonschema.validate(instance=s, schema=schema)
        except jsonschema.ValidationError as e:
            print(f"Validation error in unverified schemes at index {idx} ({s['scheme_id']}): {e.message}")
            return
            
    print("All schemes successfully passed structural validation against scheme_schema.json!")
    
    # Save the output files
    print(f"\nStep 5: Writing files to {DATA_DIR}...")
    # schemes.json contains both verified and unverified (everything)
    all_schemes = verified_schemes + unverified_schemes
    with open(SCHEMES_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(all_schemes, f, indent=2, ensure_ascii=False)
    print(f"Saved {len(all_schemes)} combined schemes to {SCHEMES_JSON_PATH}")
    
    with open(SCHEMA_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(verified_schemes, f, indent=2, ensure_ascii=False)
    print(f"Saved {len(verified_schemes)} verified schemes to {SCHEMA_JSON_PATH}")
    
    with open(UNVERIFIED_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(unverified_schemes, f, indent=2, ensure_ascii=False)
    print(f"Saved {len(unverified_schemes)} unverified schemes to {UNVERIFIED_JSON_PATH}")
    
    # Report breakdown
    print("\n================ REPORT ================")
    print(f"Total verified schemes (trusted tier): {len(verified_schemes)}")
    print(f"Total unverified schemes (discovery tier): {len(unverified_schemes)}")
    
    # Category breakdown
    print("\nUnverified schemes by category:")
    cats_counter = collections.Counter([s["scheme_category"] for s in unverified_schemes])
    for cat, count in cats_counter.most_common():
        print(f"  - {cat}: {count}")
        
    print(f"\nAmbiguous schemes flagged (no eligibility text): {len(ambiguous_schemes)}")
    if ambiguous_schemes:
        print("Sample ambiguous schemes (first 5):")
        for s in ambiguous_schemes[:5]:
            print(f"  - {s}")

if __name__ == "__main__":
    main()
