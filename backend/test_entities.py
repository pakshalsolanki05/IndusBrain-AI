from app.services.entity_extractor import extract_entities

sample = """
Pump P-101 requires inspection every 30 days.

Bearing temperature must remain below 80°C.

Valve V-102 supplies coolant.

Pressure should remain below 12 Bar.

Engineer: Rahul Sharma

Standard: ISO 9001
"""

entities = extract_entities(sample)

for entity in entities:
    print(entity)