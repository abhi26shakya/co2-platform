import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api, ApiError } from "@/services/api-client";

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("api-client request()", () => {
  const originalMockMode = process.env.NEXT_PUBLIC_MOCK_MODE;
  const originalFetch = global.fetch;

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_MOCK_MODE = originalMockMode;
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  describe("with a real backend (NEXT_PUBLIC_MOCK_MODE unset)", () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_MOCK_MODE = "false";
    });

    it("surfaces a real 401 error response instead of falling back to mock data", async () => {
      global.fetch = vi.fn().mockResolvedValue(
        jsonResponse(401, { detail: "Invalid email or password" })
      );

      await expect(
        api.post("/auth/login", { email: "real@user.com", password: "wrong" })
      ).rejects.toMatchObject({ status: 401, message: "Invalid email or password" });
    });

    it("surfaces a real 422 validation error instead of falling back to mock data", async () => {
      global.fetch = vi.fn().mockResolvedValue(
        jsonResponse(422, { detail: "Password too short" })
      );

      await expect(api.post("/auth/signup", { email: "x@x.com" })).rejects.toMatchObject({
        status: 422,
      });
    });

    it("still falls back to mock data on a genuine network failure", async () => {
      global.fetch = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));

      // No matching mock user for a fresh login -> mock path itself throws 401,
      // proving the mock handler ran rather than the raw "Network request failed".
      await expect(
        api.post("/auth/login", { email: "nobody@test.dev", password: "x" })
      ).rejects.toMatchObject({ status: 401 });
    });
  });

  describe("in mock mode (no backend configured, e.g. the demo deployment)", () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_MOCK_MODE = "true";
    });

    it("falls back to mock signup+login when the proxy returns a real error response", async () => {
      // Simulates a rewrite proxying to a dead BACKEND_URL - Vercel/Next
      // returns a real (non-network-failure) error response, not a thrown fetch.
      global.fetch = vi.fn().mockResolvedValue(jsonResponse(502, { error: "Bad Gateway" }));

      const signupResult = await api.post("/auth/signup", {
        email: "newuser@test.dev",
        password: "s3cure-pass",
        full_name: "New User",
      });
      expect(signupResult).toBeTruthy();

      const loginResult = await api.post<{ access_token: string }>("/auth/login", {
        email: "newuser@test.dev",
        password: "s3cure-pass",
      });
      expect(loginResult.access_token).toBe("mock-access-token");
    });

    it("still throws a real ApiError for wrong credentials within the mock store", async () => {
      global.fetch = vi.fn().mockResolvedValue(jsonResponse(502, { error: "Bad Gateway" }));

      await expect(
        api.post("/auth/login", { email: "demo@emissia.dev", password: "wrong-password" })
      ).rejects.toBeInstanceOf(ApiError);
    });
  });
});
