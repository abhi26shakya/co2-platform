"""Typed errors for missing external credentials.

Any code path touching Earth Engine or NASA Earthdata must check the
relevant `Settings.*_configured` flag first and raise this instead of
letting the raw SDK call fail with an opaque exception (`ee.Initialize()`
without valid credentials raises a generic `EEException`, `earthaccess`
login failures raise assorted requests/auth errors) - callers should see a
clean, typed reason instead.
"""


class CredentialsNotConfiguredError(Exception):
    def __init__(self, provider: str) -> None:
        self.provider = provider
        super().__init__(f"{provider} credentials are not configured on this deployment.")
