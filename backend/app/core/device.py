"""Best-effort, dependency-free device name derivation from a User-Agent header.

Good enough for a human-scannable "Chrome on macOS" session label - not meant
to be a precise UA parser.
"""
import re

_BROWSERS: list[tuple[str, str]] = [
    (r"Edg/", "Edge"),
    (r"OPR/", "Opera"),
    (r"Chrome/", "Chrome"),
    (r"CriOS/", "Chrome"),
    (r"Firefox/", "Firefox"),
    (r"FxiOS/", "Firefox"),
    (r"Version/.*Safari/", "Safari"),
]

_OS: list[tuple[str, str]] = [
    (r"iPhone|iPad|iPod", "iOS"),
    (r"Mac OS X", "macOS"),
    (r"Android", "Android"),
    (r"Windows", "Windows"),
    (r"Linux", "Linux"),
]


def describe_device(user_agent: str | None) -> str | None:
    if not user_agent:
        return None
    browser = next((name for pattern, name in _BROWSERS if re.search(pattern, user_agent)), None)
    os_name = next((name for pattern, name in _OS if re.search(pattern, user_agent)), None)
    if browser and os_name:
        return f"{browser} on {os_name}"
    return browser or os_name or "Unknown device"
