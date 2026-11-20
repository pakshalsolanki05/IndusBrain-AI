from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database.database import Base

class CreditWallet(Base):
    __tablename__ = "credit_wallets"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    balance = Column(Integer, nullable=False, default=0)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class CreditTransaction(Base):
    __tablename__ = "credit_transactions"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    amount = Column(Integer, nullable=False)
    balance_after = Column(Integer, nullable=False)
    transaction_type = Column(String(32), nullable=False)
    reference = Column(String(128), nullable=True, index=True)
    description = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class PaymentOrder(Base):
    __tablename__ = "payment_orders"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    package_id = Column(String(32), nullable=False)
    currency = Column(String(3), nullable=False)
    amount_minor = Column(Integer, nullable=False)
    credits = Column(Integer, nullable=False)
    razorpay_order_id = Column(String(80), unique=True, nullable=False, index=True)
    razorpay_payment_id = Column(String(80), unique=True, nullable=True, index=True)
    status = Column(String(24), nullable=False, default="created")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    paid_at = Column(DateTime(timezone=True), nullable=True)

class WebhookEvent(Base):
    __tablename__ = "billing_webhook_events"
    id = Column(Integer, primary_key=True)
    event_id = Column(String(128), unique=True, nullable=False)
    event_type = Column(String(80), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
