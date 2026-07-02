import re

# -----------------------------
# Industrial Regex Patterns
# -----------------------------

PATTERNS = {
    "Equipment": [
        r"\bPump\s+[A-Z]-\d+\b",
        r"\bValve\s+[A-Z]-\d+\b",
        r"\bMotor\s+[A-Z]-\d+\b",
        r"\bBoiler\s+[A-Z]-\d+\b",
        r"\bTank\s+[A-Z]-\d+\b",
        r"\bBearing\b",
    ],

    "Temperature": [
        r"\b\d+\s?°C\b",
    ],

    "Pressure": [
        r"\b\d+\s?Bar\b",
    ],

    "Inspection Interval": [
        r"\bevery\s+\d+\s+days\b",
        r"\b\d+\s+days\b",
        r"\bweekly\b",
        r"\bmonthly\b",
    ],

    "Standard": [
        r"\bISO\s?\d+\b",
        r"\bOISD\b",
        r"\bPESO\b",
    ],

    "Engineer": [
        r"Engineer:\s*([A-Za-z ]+)",
    ],
}


def extract_entities(text: str):
    """
    Extract industrial entities using regex.
    """

    entities = []

    for entity_type, patterns in PATTERNS.items():

        for pattern in patterns:

            matches = re.findall(pattern, text, re.IGNORECASE)

            for match in matches:

                value = match if isinstance(match, str) else match[0]

                entities.append(
                    {
                        "entity": value.strip(),
                        "entity_type": entity_type,
                        "value": value.strip(),
                    }
                )

    return entities