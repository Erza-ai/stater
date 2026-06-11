import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import {
  tokenCookieName,
  sessionCookieName,
  authApiUrl,
  tokenUrl,
  beApiUrl,
} from "@/lib/auth/config";
import { isTokenReturning } from "@/lib/auth/constants";
import type {
  AuthSessionResponse,
  BEProfileResponse,
  SessionLoadResult,
} from "../types";

const AUTH_BASE = env.AUTH_API_URL.replace(/\/$/, "");

async function proxyRequest(
  request: NextRequest,
  path: string,
): Promise<NextResponse> {
  const url = `${AUTH_BASE}/api/auth/${path}`;
  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const body = hasBody
    ? await request.json().catch(() => undefined)
    : undefined;
  const token = request.cookies.get(tokenCookieName())?.value;

  const forwardedHeaders: Record<string, string> = {};
  const origin = request.headers.get("origin");
  if (origin) {
    forwardedHeaders["origin"] = origin;
  }
  if (token) {
    forwardedHeaders["Authorization"] = `Bearer ${token}`;
  }
  if (body) {
    forwardedHeaders["Content-Type"] = "application/json";
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(url, {
      method: request.method,
      headers: forwardedHeaders,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const data = await res.json().catch(() => null);

    const response = NextResponse.json(data, { status: res.status });

    if (res.ok && isTokenReturning(path) && data?.token) {
      response.cookies.set(tokenCookieName(), data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }

    if (path === "sign-out" && res.ok) {
      response.cookies.delete(tokenCookieName());
      response.cookies.delete(sessionCookieName());
    }

    return response;
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ auth: string[] }> },
) {
  const { auth } = await params;
  const path = auth.join("/");

  if (path === "session") {
    return handleSessionLoad(request);
  }

  return proxyRequest(request, path);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ auth: string[] }> },
) {
  const { auth } = await params;
  return proxyRequest(request, auth.join("/"));
}

async function handleSessionLoad(request: NextRequest): Promise<NextResponse> {
  const token = request.cookies.get(tokenCookieName())?.value;
  if (!token) {
    return NextResponse.json(
      { session: null, user: null, profile: null },
      { status: 401 },
    );
  }

  const result: SessionLoadResult = {
    session: null,
    user: null,
    profile: null,
  };

  try {
    const sessionRes = await fetch(authApiUrl("get-session"), {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(10000),
    });
    if (!sessionRes.ok) {
      return NextResponse.json(result, { status: 401 });
    }
    const sessionData: AuthSessionResponse = await sessionRes.json();
    result.session = sessionData.session;
    result.user = sessionData.user;
  } catch {
    return NextResponse.json(result, { status: 500 });
  }

  if (!result.session) {
    return NextResponse.json(result, { status: 401 });
  }

  try {
    const productTokenRes = await fetch(tokenUrl(), {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(10000),
    });
    let bearerToken = token;
    if (productTokenRes.ok) {
      const productData = await productTokenRes.json();
      if (productData.token) {
        bearerToken = productData.token;
      }
    }

    const profileRes = await fetch(beApiUrl("/api/users"), {
      headers: { Authorization: `Bearer ${bearerToken}` },
      signal: AbortSignal.timeout(10000),
    });
    if (profileRes.ok) {
      const body = await profileRes.json();
      result.profile = body.result || body;
      console.log("[auth] BE profile loaded:", JSON.stringify(result.profile));
    } else {
      const errText = await profileRes.text().catch(() => "unknown");
      console.error(
        `[auth] BE /api/users failed: ${profileRes.status} ${errText}`,
      );
    }
  } catch (err) {
    console.error("[auth] BE profile sync error:", err);
  }

  return NextResponse.json(result);
}
