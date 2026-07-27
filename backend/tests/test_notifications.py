"""Notification preference gating + best-effort email send."""
from app.services import email as email_module
from app.services.notifications import notify_user


async def test_notify_user_respects_master_email_toggle(client, user_factory, monkeypatch):
    from app.db.session import get_db
    from app.main import app

    sent = []

    async def fake_send(self, *, to, subject, body):
        sent.append((to, subject, body))

    monkeypatch.setattr(email_module.EmailService, "send", fake_send)

    _, _, tokens = user_factory()
    headers = {"Authorization": f"Bearer {tokens['access_token']}"}

    # Disable the master email toggle.
    r = client.put(
        "/api/v1/settings/preferences",
        json={"notify_email_enabled": False, "notify_prediction_completed": True},
        headers=headers,
    )
    assert r.status_code == 200

    async for session in app.dependency_overrides[get_db]():
        from app.repositories.users import UserRepository

        me = client.get("/api/v1/auth/me", headers=headers).json()
        user = await UserRepository(session).get_by_id(me["id"])
        await notify_user(
            session, user_id=user.id, kind="prediction_completed", subject="x", body="y"
        )
        break

    assert sent == []  # master toggle off -> nothing sent, even though kind pref is True


async def test_notify_user_sends_when_enabled(client, user_factory, monkeypatch):
    from app.db.session import get_db
    from app.main import app

    sent = []

    async def fake_send(self, *, to, subject, body):
        sent.append((to, subject, body))

    monkeypatch.setattr(email_module.EmailService, "send", fake_send)

    _, _, tokens = user_factory()
    headers = {"Authorization": f"Bearer {tokens['access_token']}"}
    r = client.put(
        "/api/v1/settings/preferences",
        json={"notify_email_enabled": True, "notify_prediction_completed": True},
        headers=headers,
    )
    assert r.status_code == 200

    async for session in app.dependency_overrides[get_db]():
        from app.repositories.users import UserRepository

        me = client.get("/api/v1/auth/me", headers=headers).json()
        user = await UserRepository(session).get_by_id(me["id"])
        await notify_user(
            session,
            user_id=user.id,
            kind="prediction_completed",
            subject="Emissia: prediction complete",
            body="body text",
        )
        break

    assert len(sent) == 1
    assert sent[0][0] == user.email
    assert sent[0][1] == "Emissia: prediction complete"
