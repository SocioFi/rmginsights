// News Aggregator Edge Function
// Fetches news from RSS feeds and stores in database

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
  description?: string;
  content?: string;
  "content:encoded"?: string;
  enclosure?: {
    url?: string;
  };
}

interface RSSFeed {
  items: RSSItem[];
}

// RMG-related keywords for filtering
const RMG_KEYWORDS = [
  "RMG", "ready-made garment", "garment", "apparel", "textile", "clothing",
  "factory", "manufacturing", "Bangladesh", "BGMEA", "export", "buyer",
  "supplier", "fashion", "sustainability", "compliance", "worker", "labor",
  "cotton", "fabric", "production", "supply chain", "fast fashion"
];

// Category mapping based on keywords
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "AI in RMG": ["AI", "artificial intelligence", "machine learning", "automation", "digital", "technology"],
  "Production": ["production", "manufacturing", "factory", "output", "capacity"],
  "Compliance": ["compliance", "safety", "audit", "certification", "ESG", "standards"],
  "Buyer Trends": ["buyer", "retailer", "brand", "order", "demand", "market"],
  "Sustainability": ["sustainability", "green", "environment", "renewable", "carbon", "waste"],
  "Workforce": ["worker", "labor", "employee", "wage", "training", "skill"],
  "Policy": ["policy", "government", "regulation", "law", "ministry"],
  "Innovation": ["innovation", "R&D", "research", "development", "new technology"],
  "Export Markets": ["export", "trade", "international", "overseas", "foreign"],
  "Quality Control": ["quality", "inspection", "standard", "defect", "testing"],
  "Supply Chain": ["supply chain", "logistics", "sourcing", "vendor", "supplier"],
  "Finance": ["finance", "investment", "revenue", "profit", "cost", "funding"],
};

function calculateRelevanceScore(title: string, description: string): number {
  const text = `${title} ${description}`.toLowerCase();
  let score = 0;
  
  // Check for RMG keywords
  for (const keyword of RMG_KEYWORDS) {
    if (text.includes(keyword.toLowerCase())) {
      score += 5;
    }
  }
  
  // Bangladesh-specific boost
  if (text.includes("bangladesh")) {
    score += 10;
  }
  
  // Cap at 100
  return Math.min(score, 100);
}

function detectCategory(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  let bestCategory = "Production"; // default
  let maxMatches = 0;
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let matches = 0;
    for (const keyword of keywords) {
      if (text.includes(keyword.toLowerCase())) {
        matches++;
      }
    }
    if (matches > maxMatches) {
      maxMatches = matches;
      bestCategory = category;
    }
  }
  
  return bestCategory;
}

function calculateTimelinessScore(pubDate: string): number {
  const published = new Date(pubDate);
  const now = new Date();
  const hoursAgo = (now.getTime() - published.getTime()) / (1000 * 60 * 60);
  
  if (hoursAgo < 1) return 100;
  if (hoursAgo < 6) return 90;
  if (hoursAgo < 24) return 75;
  if (hoursAgo < 48) return 60;
  if (hoursAgo < 168) return 40; // 1 week
  return 20;
}

function calculateQualityScore(source: string, description: string): number {
  let score = 50; // base score
  
  // Source credibility
  const credibleSources = ["reuters", "bloomberg", "financial times", "the daily star", "business standard"];
  if (credibleSources.some(s => source.toLowerCase().includes(s))) {
    score += 20;
  }
  
  // Article length (longer = better)
  if (description && description.length > 200) {
    score += 15;
  }
  if (description && description.length > 500) {
    score += 15;
  }
  
  return Math.min(score, 100);
}

async function fetchRSSFeed(url: string): Promise<RSSItem[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS: ${response.statusText}`);
    }
    
    const xml = await response.text();
    
    // Simple XML parsing for RSS (for MVP, consider using a proper RSS parser library)
    const items: RSSItem[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    
    while ((match = itemRegex.exec(xml)) !== null) {
      const itemXml = match[1];
      
      const titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/);
      const linkMatch = itemXml.match(/<link>(.*?)<\/link>/);
      const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/);
      const descMatch = itemXml.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/);
      const enclosureMatch = itemXml.match(/<enclosure url="(.*?)"/);
      
      if (titleMatch && linkMatch && pubDateMatch) {
        items.push({
          title: (titleMatch[1] || titleMatch[2] || "").replace(/<[^>]*>/g, "").trim(),
          link: linkMatch[1].trim(),
          pubDate: pubDateMatch[1].trim(),
          description: descMatch ? (descMatch[1] || descMatch[2] || "").replace(/<[^>]*>/g, "").trim() : "",
          enclosure: enclosureMatch ? { url: enclosureMatch[1] } : undefined,
        });
      }
    }
    
    return items;
  } catch (error) {
    console.error(`Error fetching RSS feed ${url}:`, error);
    return [];
  }
}

async function aggregateNews(supabase: any) {
  // Get enabled news sources
  const { data: sources, error: sourcesError } = await supabase
    .from("news_sources")
    .select("*")
    .eq("enabled", true)
    .order("priority", { ascending: true });
  
  if (sourcesError) {
    throw new Error(`Failed to fetch news sources: ${sourcesError.message}`);
  }
  
  if (!sources || sources.length === 0) {
    console.log("No news sources configured");
    return { processed: 0, new: 0 };
  }
  
  let totalProcessed = 0;
  let totalNew = 0;
  
  // Process each source
  for (const source of sources) {
    if (source.type !== "rss") continue;
    
    console.log(`Fetching from ${source.name}...`);
    const items = await fetchRSSFeed(source.url);
    
    for (const item of items) {
      totalProcessed++;
      
      // Check if article already exists
      const { data: existing } = await supabase
        .from("news_articles")
        .select("id")
        .eq("source_url", item.link)
        .single();
      
      if (existing) {
        continue; // Skip duplicates
      }
      
      // Calculate scores
      const description = item.description || "";
      const relevanceScore = calculateRelevanceScore(item.title, description);
      const category = detectCategory(item.title, description);
      const timelinessScore = calculateTimelinessScore(item.pubDate);
      const qualityScore = calculateQualityScore(source.name, description);
      const overallScore = (relevanceScore * 0.5) + (qualityScore * 0.3) + (timelinessScore * 0.2);
      
      // Only insert if relevance score is above threshold (30)
      if (relevanceScore < 30) {
        continue;
      }
      
      // Extract image URL
      let imageUrl = item.enclosure?.url || null;
      if (!imageUrl && description) {
        const imgMatch = description.match(/<img[^>]+src="([^"]+)"/);
        if (imgMatch) {
          imageUrl = imgMatch[1];
        }
      }
      
      // Insert article
      const { error: insertError } = await supabase
        .from("news_articles")
        .insert({
          title: item.title,
          summary: description.substring(0, 500), // First 500 chars as summary
          source: source.name,
          source_url: item.link,
          image_url: imageUrl,
          category: category,
          published_at: new Date(item.pubDate).toISOString(),
          relevance_score: relevanceScore,
          quality_score: qualityScore,
          timeliness_score: timelinessScore,
          overall_score: overallScore,
        });
      
      if (insertError) {
        console.error(`Error inserting article: ${insertError.message}`);
        continue;
      }
      
      totalNew++;
    }
    
    // Update last_fetched_at
    await supabase
      .from("news_sources")
      .update({ last_fetched_at: new Date().toISOString() })
      .eq("id", source.id);
  }
  
  return { processed: totalProcessed, new: totalNew };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Aggregate news
    const result = await aggregateNews(supabase);
    
    return new Response(
      JSON.stringify({
        success: true,
        processed: result.processed,
        new: result.new,
        message: `Processed ${result.processed} articles, ${result.new} new articles added`,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error in news aggregator:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});



