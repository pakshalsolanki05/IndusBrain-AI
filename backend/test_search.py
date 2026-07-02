from app.services.retriever import search_documents

question = "How often should Pump P-101 be inspected?"

results = search_documents(question)

print("\nTop Retrieved Chunks:\n")

for i, doc in enumerate(results["documents"][0], start=1):

    print("=" * 60)
    print(f"Result {i}")
    print("=" * 60)
    print(doc)
    print()