import os
import base64
import requests
from typing import Any, Dict
from dotenv import load_dotenv, find_dotenv

# Ensure .env is loaded regardless of CWD
_loaded = False
# 1) Prefer repo root .env (parent of backend/)
_project_env = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".env"))
if os.path.exists(_project_env):
    load_dotenv(_project_env)
    _loaded = True
# 2) Also try walking up from current working directory (works if started in backend/)
if not _loaded:
    _found = find_dotenv(usecwd=True)
    if _found:
        load_dotenv(_found)
        _loaded = True

class KnotClient:
    def __init__(self):
        self.base_url = os.getenv("KNOT_BASE_URL", "https://development.knotapi.com")
        self.version = os.getenv("KNOT_VERSION", "2.0")
        self.client_id = os.getenv("KNOT_CLIENT_ID")
        self.secret = os.getenv("KNOT_SECRET")
        self.mock = not (self.client_id and self.secret)

    def _auth_header(self) -> str:
        token = base64.b64encode(f"{self.client_id}:{self.secret}".encode()).decode()
        return f"Basic {token}"

    def create_session(self, session_type: str = "transaction_link", external_user_id: str = "demo-user-1", card_id: str | None = None,
                       phone_number: str | None = None, email: str | None = None, processor_token: str | None = None) -> Dict[str, Any]:
        """Create a Knot session using Basic auth per API spec.
        Returns {"sessionId": str, "mock": bool, ...}
        Falls back to mock on failure so the UI can continue.
        """
        if self.mock:
            return {"sessionId": "mock-session-123", "mock": True}
        url = f"{self.base_url}/session/create"
        headers = {
            "Content-Type": "application/json",
            "Knot-Version": self.version,
            "Authorization": self._auth_header(),
        }
        payload: Dict[str, Any] = {
            "type": session_type,
            "external_user_id": external_user_id,
        }
        # Optional fields per spec
        if card_id is not None:
            payload["card_id"] = card_id
        if phone_number is not None:
            payload["phone_number"] = phone_number
        if email is not None:
            payload["email"] = email
        if processor_token is not None:
            payload["processor_token"] = processor_token
        try:
            resp = requests.post(url, json=payload, headers=headers, timeout=10)
            if resp.status_code >= 400:
                return {"sessionId": "mock-session-err", "mock": True, "error": resp.text, "status": resp.status_code}
            data = resp.json()
            # API returns { session: "..." } per spec. Map to sessionId for SDK consumer.
            session_id = data.get("session") or data.get("sessionId") or data.get("id") or data.get("session_id")
            if not session_id:
                return {"sessionId": "mock-session-missing", "mock": True, "raw": data}
            return {"sessionId": session_id, "mock": False}
        except Exception as e:
            return {"sessionId": "mock-session-ex", "mock": True, "error": str(e)}

    def sync_transactions(self, merchant_id: int, external_user_id: str, limit: int = 5) -> Dict[str, Any]:
        """Call mock sync endpoint to retrieve transactions."""
        # Using provided tunnel mock endpoint
        url = "https://knot.tunnel.tel/transactions/sync"
        body = {
            "merchant_id": merchant_id,
            "external_user_id": external_user_id,
            "limit": limit,
        }
        try:
            resp = requests.post(url, json=body, headers={"Content-Type": "application/json"}, timeout=15)
            if resp.status_code >= 400:
                return {"error": resp.text, "status": resp.status_code, "merchant_id": merchant_id}
            return resp.json()
        except Exception as e:
            return {"error": str(e), "merchant_id": merchant_id}
