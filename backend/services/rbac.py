"""
ShareKind Security Layer: Role-Based Access Control (RBAC) & Audit Engine.
Enforces least-privilege permissions and personal data isolation.
"""

from enum import Enum
from typing import Dict, Any, Optional
import time
import uuid

class Role(str, Enum):
    DONOR = "DONOR"
    NGO = "NGO"
    SUPPLIER = "SUPPLIER"
    ADMIN = "ADMIN"

# Explicit role-to-permission mapping matrix
ROLE_PERMISSIONS = {
    Role.DONOR: {
        "donations:create",
        "donations:read_own",
        "impact:read_own",
        "profile:manage"
    },
    Role.NGO: {
        "needs:create",
        "needs:read",
        "needs:update",
        "suppliers:compare",
        "orders:create",
        "orders:confirm_receipt",
        "profile:manage",
        "verification:submit"
    },
    Role.SUPPLIER: {
        "orders:read_assigned",
        "orders:accept",
        "orders:update_status",
        "catalog:manage",
        "profile:manage",
        "verification:submit"
    },
    Role.ADMIN: {
        "admin:view_all",
        "admin:verify_ngo",
        "admin:verify_supplier",
        "admin:audit_logs",
        "analytics:export_s3",
        "system:manage"
    }
}

class SecurityService:
    @staticmethod
    def verify_permission(user_role: str, required_permission: str) -> bool:
        """
        Validates if the specified role possesses authorization for the action.
        """
        try:
            role_enum = Role(user_role.upper())
            allowed_permissions = ROLE_PERMISSIONS.get(role_enum, set())
            return required_permission in allowed_permissions
        except ValueError:
            return False

    @staticmethod
    def mask_donor_pii(record: Dict[str, Any], requesting_user: Dict[str, Any]) -> Dict[str, Any]:
        """
        [PRIVACY PROTECTION]
        Strictly isolates donor PII. If another user or public endpoint views records,
        all personal names, emails, and payment references are redacted.
        Only the donor themselves or an authorized platform auditor can view full details.
        """
        record_copy = dict(record)
        is_owner = requesting_user.get("user_id") == record.get("donor_id")
        is_admin = requesting_user.get("role") == Role.ADMIN.value

        if not (is_owner or is_admin):
            record_copy["donor_name"] = "Anonymous Generous Donor"
            record_copy["donor_email"] = "[REDACTED]"
            record_copy["payment_ref"] = "[PROTECTED]"
            record_copy.pop("donor_phone", None)
            record_copy.pop("ip_address", None)
            
        return record_copy

    @staticmethod
    def create_audit_record(
        action: str,
        user_id: str,
        user_role: str,
        resource_id: str,
        details: Dict[str, Any],
        is_demo: bool = True
    ) -> Dict[str, Any]:
        """
        Generates an immutable security audit entry.
        """
        return {
            "audit_id": f"aud_{uuid.uuid4().hex[:12]}",
            "timestamp": int(time.time()),
            "iso_time": time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
            "action": action,
            "user_id": user_id,
            "user_role": user_role,
            "resource_id": resource_id,
            "details": details,
            "is_demo": is_demo
        }
