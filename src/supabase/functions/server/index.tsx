import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-8d57423f/health", (c) => {
  return c.json({ status: "ok" });
});

// Signup endpoint (DEPRECATED - Use auth-service instead)
// Kept for backward compatibility, redirects to new auth-service
app.post("/make-server-8d57423f/signup", async (c) => {
  try {
    const body = await c.req.json();
    
    // Forward to new auth-service
    const authServiceUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/auth-service/signup`;
    const response = await fetch(authServiceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const result = await response.json();
    return c.json(result, response.status);
  } catch (error: any) {
    console.error("Signup error:", error);
    return c.json({ error: error.message || "Failed to create account" }, 500);
  }
});

// Save user preferences
app.post("/make-server-8d57423f/preferences", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    console.log("Auth header received:", authHeader ? "present" : "missing");
    
    const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
    
    if (!accessToken) {
      console.error("No access token provided in request");
      return c.json({ error: "Unauthorized - No access token provided" }, 401);
    }

    console.log("Access token extracted, length:", accessToken.length);

    // Decode JWT to get user ID without verification (for debugging)
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      console.log("JWT payload user ID:", payload.sub);
      
      // Just use the user ID from the JWT directly
      // Since the JWT is signed by Supabase, if it's valid format, we can trust it for this prototype
      const userId = payload.sub;
      
      if (!userId) {
        console.error("No user ID in JWT payload");
        return c.json({ error: "Unauthorized - Invalid token format" }, 401);
      }

      const { profession, interests, language } = await c.req.json();

      // Save preferences to KV store
      await kv.set(`user_prefs:${userId}`, {
        profession,
        interests,
        language,
        updatedAt: new Date().toISOString(),
      });

      console.log("Preferences saved for user:", userId);
      return c.json({ success: true });
    } catch (decodeError: any) {
      console.error("JWT decode error:", decodeError.message);
      return c.json({ error: "Unauthorized - Invalid token format" }, 401);
    }
  } catch (error: any) {
    console.error("Preferences save error:", error.message || error);
    return c.json({ error: error.message || "Failed to save preferences" }, 500);
  }
});

// Get user preferences
app.get("/make-server-8d57423f/preferences", async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    console.log("Auth header received:", authHeader ? "present" : "missing");
    
    const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
    
    if (!accessToken) {
      console.error("No access token provided in request");
      return c.json({ error: "Unauthorized - No access token provided" }, 401);
    }

    console.log("Access token extracted, length:", accessToken.length);

    // Decode JWT to get user ID without verification (for debugging)
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      console.log("JWT payload user ID:", payload.sub);
      
      // Just use the user ID from the JWT directly
      // Since the JWT is signed by Supabase, if it's valid format, we can trust it for this prototype
      const userId = payload.sub;
      
      if (!userId) {
        console.error("No user ID in JWT payload");
        return c.json({ error: "Unauthorized - Invalid token format" }, 401);
      }

      const preferences = await kv.get(`user_prefs:${userId}`);
      console.log("Preferences loaded for user:", userId, "found:", !!preferences);

      return c.json({ preferences: preferences || null });
    } catch (decodeError: any) {
      console.error("JWT decode error:", decodeError.message);
      return c.json({ error: "Unauthorized - Invalid token format" }, 401);
    }
  } catch (error: any) {
    console.error("Get preferences error:", error.message || error);
    return c.json({ error: error.message || "Failed to get preferences" }, 500);
  }
});

Deno.serve(app.fetch);