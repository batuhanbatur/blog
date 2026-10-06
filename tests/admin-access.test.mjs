import assert from "node:assert/strict"
import { test, mock } from "node:test"

const owner = "11111111-1111-4111-8111-111111111111"
let authCalls = 0
mock.module("@supabase/supabase-js", {
  namedExports: {
    createClient: () => ({ auth: { getUser: async token => {
      authCalls++
      if (token === "throws") throw new Error("Auth unavailable")
      if (token === "invalid") return { data: null, error: { message: "Invalid token" } }
      return { data: { user: { id: token === "owner-token" ? owner : "another-user" } }, error: null }
    } } }),
  },
})
const { requireUser } = await import("../app/lib/requireUser.js")
const request = token => new Request("https://example.test", {
  headers: token ? { authorization: `Bearer ${token}` } : {},
})

test("admin APIs deny missing configuration, unauthenticated users and other accounts", async () => {
  const previous = process.env.BLOG_ADMIN_USER_ID
  try {
    delete process.env.BLOG_ADMIN_USER_ID
    assert.equal(await requireUser(request("owner-token")), null)
    assert.equal(authCalls, 0)
    process.env.BLOG_ADMIN_USER_ID = owner
    assert.equal(await requireUser(request()), null)
    assert.equal(await requireUser(request("invalid")), null)
    assert.equal(await requireUser(request("other-token")), null)
    assert.equal(await requireUser(request("throws")), null)
    assert.equal((await requireUser(request("owner-token"))).id, owner)
  } finally {
    if (previous === undefined) delete process.env.BLOG_ADMIN_USER_ID
    else process.env.BLOG_ADMIN_USER_ID = previous
  }
})

test("retired audio endpoint never calls external services", async () => {
  const fetchMock = mock.method(globalThis, "fetch", () => {
    throw new Error("Unexpected external call")
  })
  try {
    const { POST } = await import("../app/api/generate-audio/route.js")
    const response = await POST(request("owner-token"))
    assert.equal(response.status, 410)
    assert.match((await response.json()).error, /no longer available/)
    assert.equal(fetchMock.mock.callCount(), 0)
  } finally {
    fetchMock.mock.restore()
  }
})
