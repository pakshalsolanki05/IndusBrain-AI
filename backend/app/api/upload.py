from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends,
)

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.repositories.document_repository import (
    create_document,
)

from app.services.document_service import (
    save_document,
)

from app.services.ai.document_intelligence import (
    run_document_intelligence,
)

from app.security.dependencies import (
    get_current_user,
)

from app.models.user import User


router = APIRouter(
    prefix="/upload",
    tags=["Document Upload"],
)


@router.post("/")
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Complete IndusBrain AI document upload pipeline.

    Pipeline:

    1. Save uploaded file
    2. Parse document and extract text
    3. Create vector embeddings for RAG
    4. Store document metadata
    5. Run AI Document Intelligence
    6. Extract and clean entities
    7. Extract and clean relationships
    8. Generate document analysis
    9. Store intelligence results
    """

    print("=" * 60)
    print("🚀 STARTING DOCUMENT UPLOAD PIPELINE")
    print("=" * 60)

    # -----------------------------------------------------
    # Step 1: Save and process document
    # -----------------------------------------------------

    try:

        result = save_document(
            file=file,
            owner_id=current_user.id,
        )

    except Exception as e:

        print("=" * 60)
        print("❌ DOCUMENT PROCESSING FAILED")
        print(e)
        print("=" * 60)

        raise

    # -----------------------------------------------------
    # Step 2: Extract processing results
    # -----------------------------------------------------

    metadata = result["metadata"]

    text = result["text"]

    print("✅ Document processed successfully.")

    print(
        f"📄 Extracted text length: "
        f"{len(text)} characters"
    )

    # -----------------------------------------------------
    # Step 3: Store document metadata
    # -----------------------------------------------------

    try:

        document = create_document(
            db=db,
            data=metadata,
            owner_id=current_user.id,
        )

        print(
            f"✅ Document stored with ID: "
            f"{document.id}"
        )

    except Exception as e:

        print("=" * 60)
        print("❌ DOCUMENT DATABASE SAVE FAILED")
        print(e)
        print("=" * 60)

        raise

    # -----------------------------------------------------
    # Step 4: Run AI Document Intelligence
    # -----------------------------------------------------
    #
    # This single pipeline now handles:
    #
    # - Domain classification
    # - Executive summary
    # - Entity extraction
    # - Entity cleaning
    # - Entity type correction
    # - Entity deduplication
    # - Relationship extraction
    # - Relationship cleaning
    # - Relationship deduplication
    # - Insights
    # - Recommendations
    #
    # IMPORTANT:
    #
    # We no longer separately call:
    #
    # save_entities(regex_entities)
    # extract_relationships(text)
    # save_relationships(...)
    #
    # This prevents duplicate Knowledge Graph data
    # and avoids unnecessary AI processing.
    # -----------------------------------------------------

    if text and text.strip():

        try:

            analysis = run_document_intelligence(
                db=db,
                document=document,
                text=text,
            )

            if analysis:

                print(
                    "✅ AI Document Intelligence "
                    "completed successfully."
                )

            else:

                print(
                    "⚠ AI Document Intelligence "
                    "returned no analysis."
                )

        except Exception as e:

            # Do not fail the entire upload if
            # AI intelligence processing fails.
            #
            # The document has already been saved
            # and should still be available for RAG/chat.

            print("=" * 60)
            print(
                "⚠ AI DOCUMENT INTELLIGENCE FAILED"
            )
            print(e)
            print("=" * 60)

    else:

        print(
            "⚠ No document text available "
            "for AI analysis."
        )

    # -----------------------------------------------------
    # Step 5: Complete
    # -----------------------------------------------------

    print("=" * 60)
    print("🎉 DOCUMENT UPLOAD PIPELINE COMPLETED")
    print("=" * 60)

    return {
        "message": "Document uploaded successfully.",
        "document_id": document.id,
    }