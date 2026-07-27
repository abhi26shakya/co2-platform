"""Typed errors for missing external credentials.

Mirrors ml-service/app/core/errors.py. Any code path touching Earth Engine
or NASA Earthdata must check the relevant `Settings.*_configured` flag
first and raise this instead of letting the raw SDK call fail with an
opaque exception.
"""


class CredentialsNotConfiguredError(Exception):
    def __init__(self, provider: str) -> None:
        self.provider = provider
        super().__init__(f"{provider} credentials are not configured on this deployment.")
