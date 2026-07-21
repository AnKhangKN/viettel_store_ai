import hashlib
import hmac
import urllib.parse
from typing import Dict, Any


class VNPayHelper:
    """
    Utility helper class for VNPay 2.1.0 HMAC-SHA512 calculation and validation.
    """

    @staticmethod
    def generate_payment_url(payment_url: str, secret_key: str, params: Dict[str, Any]) -> str:
        """
        Generates the full VNPay payment URL with sorted parameters and vnp_SecureHash checksum.
        """
        cleaned_params = {
            k: str(v)
            for k, v in params.items()
            if v is not None and str(v) != "" and k not in ("vnp_SecureHash", "vnp_SecureHashType")
        }

        # Sort parameters alphabetically by key
        sorted_params = sorted(cleaned_params.items(), key=lambda x: x[0])

        # Construct hash data string
        hash_data = "&".join([f"{k}={urllib.parse.quote_plus(v)}" for k, v in sorted_params])

        # Compute HMAC-SHA512
        secure_hash = hmac.new(
            secret_key.encode("utf-8"),
            hash_data.encode("utf-8"),
            hashlib.sha512
        ).hexdigest()

        query_string = f"{hash_data}&vnp_SecureHash={secure_hash}"
        return f"{payment_url}?{query_string}"

    @staticmethod
    def validate_response(secret_key: str, params: Dict[str, Any]) -> bool:
        """
        Validates the incoming vnp_SecureHash signature from VNPay return / IPN callbacks.
        """
        vnp_secure_hash = params.get("vnp_SecureHash")
        if not vnp_secure_hash:
            return False

        cleaned_params = {
            k: str(v)
            for k, v in params.items()
            if v is not None and str(v) != "" and k not in ("vnp_SecureHash", "vnp_SecureHashType")
        }

        sorted_params = sorted(cleaned_params.items(), key=lambda x: x[0])
        hash_data = "&".join([f"{k}={urllib.parse.quote_plus(v)}" for k, v in sorted_params])

        calculated_hash = hmac.new(
            secret_key.encode("utf-8"),
            hash_data.encode("utf-8"),
            hashlib.sha512
        ).hexdigest()

        return calculated_hash.lower() == str(vnp_secure_hash).lower()
