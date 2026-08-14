"""Pure-function tests for load_co2.py's external_id derivation - no DB,
no fixtures needed. The DB-touching load() coroutine itself isn't covered
here (would need a real facilities.json + plant_results.json fixture pair
and a live session, matching the async DB test pattern used elsewhere in
this test suite) - this covers the one piece that's easy to get wrong
silently: a facility whose auto-derived external_id collides with, or
diverges unexpectedly from, an already-seeded plant's hand-chosen one."""
from scripts.load_co2 import MATCH, _external_id_for


def test_seeded_plants_keep_their_hand_chosen_external_id():
    for name, expected in MATCH.items():
        assert _external_id_for(name) == expected


def test_new_facility_gets_auto_derived_external_id():
    assert _external_id_for("ShriSingajiMalwa") == "IND-SHRISINGAJIMALWA"
    assert _external_id_for("Rihand") == "IND-RIHAND"


def test_auto_derived_id_strips_non_alphanumeric():
    assert _external_id_for("VINDH_CHAL STPS") == "IND-VINDHCHALSTPS"
