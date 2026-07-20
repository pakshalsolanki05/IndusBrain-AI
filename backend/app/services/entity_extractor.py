import re
import spacy

# -----------------------------
# Load spaCy model
# -----------------------------

nlp = spacy.load("en_core_web_sm")

# -----------------------------
# Industrial Regex Patterns
# -----------------------------

PATTERNS = {
    "Equipment": [
        r"\bPump\s+[A-Z]?-?\d+\b",
        r"\bValve\s+[A-Z]?-?\d+\b",
        r"\bMotor\s+[A-Z]?-?\d+\b",
        r"\bBoiler\s+[A-Z]?-?\d+\b",
        r"\bTank\s+[A-Z]?-?\d+\b",
        r"\bBearing\b",
        r"\bCompressor\b",
        r"\bGenerator\b",
    ],

    "Temperature": [
        r"\b\d+\s?°C\b",
    ],

    "Pressure": [
        r"\b\d+\s?(?:Bar|BAR|bar)\b",
    ],

    "Inspection Interval": [
        r"\bevery\s+\d+\s+days\b",
        r"\b\d+\s+days\b",
        r"\bweekly\b",
        r"\bmonthly\b",
        r"\byearly\b",
    ],

    "Standard": [
        r"\bISO[- ]?\d+\b",
        r"\bOISD\b",
        r"\bPESO\b",
        r"\bAPI[- ]?\d+\b",
        r"\bASME\b",
    ],
}


# ----------------------------------------
# Generic Keywords (Healthcare, Analytics,
# AI, Finance, etc.)
# ----------------------------------------

KEYWORDS = {
    "Hospital": "Organization",
    "Healthcare": "Domain",
    "Patient": "Domain",
    "Dashboard": "Software",
    "Tableau": "Software",
    "Power BI": "Software",
    "Python": "Technology",
    "Machine Learning": "Technology",
    "Artificial Intelligence": "Technology",
    "AI": "Technology",
    "KPI": "Business",
    "Analytics": "Business",
    "Performance": "Business",
    "Administrator": "Role",
}


def extract_entities(text: str):
    """
    Hybrid Entity Extraction
    Regex + spaCy + Keywords
    """

    entities = []

    seen = set()

    # -------------------------------------------------
    # 1. Industrial Regex
    # -------------------------------------------------

    for entity_type, patterns in PATTERNS.items():

        for pattern in patterns:

            matches = re.findall(
                pattern,
                text,
                re.IGNORECASE,
            )

            for match in matches:

                value = (
                    match
                    if isinstance(match, str)
                    else match[0]
                )

                key = value.lower()

                if key in seen:
                    continue

                seen.add(key)

                entities.append(
                    {
                        "entity": value.strip(),
                        "entity_type": entity_type,
                        "value": value.strip(),
                    }
                )

    # -------------------------------------------------
    # 2. spaCy Named Entity Recognition
    # -------------------------------------------------

    doc = nlp(text)

    LABEL_MAP = {
        "PERSON": "Person",
        "ORG": "Organization",
        "GPE": "Location",
        "LOC": "Location",
        "DATE": "Date",
        "TIME": "Time",
        "MONEY": "Money",
        "PRODUCT": "Product",
        "EVENT": "Event",
        "LAW": "Law",
    }

    for ent in doc.ents:

        if len(ent.text.strip()) < 3:
            continue

        entity_type = LABEL_MAP.get(
            ent.label_,
            "Other",
        )

        key = ent.text.lower()

        if key in seen:
            continue

        seen.add(key)

        entities.append(
            {
                "entity": ent.text.strip(),
                "entity_type": entity_type,
                "value": ent.text.strip(),
            }
        )

    # -------------------------------------------------
    # 3. Keyword Extraction
    # -------------------------------------------------

    lower_text = text.lower()

    for keyword, entity_type in KEYWORDS.items():

        if keyword.lower() in lower_text:

            key = keyword.lower()

            if key in seen:
                continue

            seen.add(key)

            entities.append(
                {
                    "entity": keyword,
                    "entity_type": entity_type,
                    "value": keyword,
                }
            )

    return entities