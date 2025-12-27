// News API Edge Function
// Provides endpoints for fetching news articles

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    const url = new URL(req.url);
    const path = url.pathname;
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get user if authenticated
    const authHeader = req.headers.get("Authorization");
    let userId = null;
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }
    
    // Route: GET /news-api/feed
    if (path.endsWith("/feed") && req.method === "GET") {
      const limit = parseInt(url.searchParams.get("limit") || "20");
      const offset = parseInt(url.searchParams.get("offset") || "0");
      const category = url.searchParams.get("category");
      const forYou = url.searchParams.get("for_you") === "true";
      
      let query = supabase
        .from("news_articles")
        .select("*", { count: "exact" })
        .order("overall_score", { ascending: false })
        .order("published_at", { ascending: false })
        .range(offset, offset + limit - 1);
      
      // Filter by category if provided
      if (category && category !== "all") {
        query = query.eq("category", category);
      }
      
      // For "For You" feed, we'll implement personalization in Phase 5
      // For now, just return top articles
      if (forYou && userId) {
        // TODO: Implement personalization in Phase 5
        // For now, return top articles
      }
      
      const { data: articles, error, count } = await query;
      
      if (error) {
        throw new Error(error.message);
      }
      
      return new Response(
        JSON.stringify({
          articles: articles || [],
          total: count || 0,
          has_more: (count || 0) > offset + limit,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }
    
    // Route: GET /news-api/articles/:id
    if (path.match(/\/articles\/[^/]+$/) && req.method === "GET") {
      const articleId = path.split("/").pop();
      
      const { data: article, error } = await supabase
        .from("news_articles")
        .select("*")
        .eq("id", articleId)
        .single();
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!article) {
        return new Response(
          JSON.stringify({ error: "Article not found" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 404,
          }
        );
      }
      
      // Track reading pattern if user is authenticated (Pro/Business tier)
      if (userId) {
        // Check subscription tier (will be implemented in Phase 3)
        // For now, just log the view
        await supabase.from("reading_patterns").insert({
          user_id: userId,
          article_id: articleId,
          category: article.category,
        });
      }
      
      return new Response(
        JSON.stringify(article),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }
    
    // Route: GET /news-api/search
    if (path.endsWith("/search") && req.method === "GET") {
      const query = url.searchParams.get("q");
      const category = url.searchParams.get("category");
      const limit = parseInt(url.searchParams.get("limit") || "20");
      const offset = parseInt(url.searchParams.get("offset") || "0");
      
      if (!query) {
        return new Response(
          JSON.stringify({ error: "Search query required" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }
      
      let dbQuery = supabase
        .from("news_articles")
        .select("*", { count: "exact" })
        .or(`title.ilike.%${query}%,summary.ilike.%${query}%`)
        .order("overall_score", { ascending: false })
        .order("published_at", { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (category && category !== "all") {
        dbQuery = dbQuery.eq("category", category);
      }
      
      const { data: articles, error, count } = await dbQuery;
      
      if (error) {
        throw new Error(error.message);
      }
      
      return new Response(
        JSON.stringify({
          articles: articles || [],
          total: count || 0,
          has_more: (count || 0) > offset + limit,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }
    
    // Route: GET /news-api/categories
    if (path.endsWith("/categories") && req.method === "GET") {
      const { data: categories, error } = await supabase
        .from("news_articles")
        .select("category")
        .order("category");
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Get unique categories with counts
      const categoryMap = new Map<string, number>();
      categories?.forEach((item) => {
        categoryMap.set(item.category, (categoryMap.get(item.category) || 0) + 1);
      });
      
      const categoryList = Array.from(categoryMap.entries()).map(([category, count]) => ({
        category,
        count,
      }));
      
      return new Response(
        JSON.stringify(categoryList),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }
    
    return new Response(
      JSON.stringify({ error: "Not found" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      }
    );
  } catch (error: any) {
    console.error("Error in news API:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});



