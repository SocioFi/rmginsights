// News Scorer Edge Function
// Scores articles using OpenAI GPT-4 for relevance, quality, and timeliness
// Generates AI summaries and insights

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { OpenAI } from "https://deno.land/x/openai@v4.20.1/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY")!;

    if (!openaiApiKey) {
      throw new Error("OPENAI_API_KEY not set");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const openai = new OpenAI({ apiKey: openaiApiKey });

    // Get unscored articles (limit to 10 per run to avoid rate limits)
    const { data: articles, error } = await supabase
      .from("news_articles")
      .select("*")
      .or("relevance_score.is.null,relevance_score.eq.0")
      .limit(10)
      .order("published_at", { ascending: false });

    if (error) throw error;
    if (!articles || articles.length === 0) {
      return new Response(
        JSON.stringify({ message: "No articles to score" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    let scored = 0;
    for (const article of articles) {
      try {
        // Check cache first
        const { data: cached } = await supabase
          .from("ai_analysis_cache")
          .select("analysis_result")
          .eq("article_id", article.id)
          .eq("analysis_type", "scoring")
          .single();

        if (cached?.analysis_result) {
          const result = cached.analysis_result;
          await supabase
            .from("news_articles")
            .update({
              relevance_score: result.relevance_score,
              quality_score: result.quality_score,
              timeliness_score: result.timeliness_score,
              overall_score: result.overall_score,
              ai_summary: result.ai_summary,
              ai_insights: result.ai_insights,
            })
            .eq("id", article.id);
          scored++;
          continue;
        }

        // Score with OpenAI
        const prompt = `Analyze this RMG industry news article and provide scores:

Title: ${article.title}
Summary: ${article.summary || "N/A"}
Source: ${article.source}
Published: ${article.published_at}

Rate on a scale of 0-100:
1. Relevance to RMG industry (0-100)
2. Article quality and credibility (0-100)
3. Timeliness and news value (0-100)

Also provide:
- Primary category (one of: AI in RMG, Production, Compliance, Buyer Trends, Sustainability, Workforce, Policy, Innovation, Export Markets, Quality Control, Supply Chain, Fashion Trends, Raw Materials, Finance, Logistics, Trade Agreements, Digitalization, E-commerce, Cost Optimization, Market Analysis)
- Brief AI-generated insight (1-2 sentences)
- Key topics/tags (comma-separated)

Respond in JSON format:
{
  "relevance_score": number,
  "quality_score": number,
  "timeliness_score": number,
  "overall_score": number,
  "category": string,
  "ai_summary": string,
  "ai_insights": {"insight": string, "topics": string[]}
}`;

        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini", // Cheaper than GPT-4
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
          response_format: { type: "json_object" },
        });

        const result = JSON.parse(completion.choices[0].message.content || "{}");

        // Calculate overall score
        const overallScore = (
          (result.relevance_score || 0) * 0.5 +
          (result.quality_score || 0) * 0.3 +
          (result.timeliness_score || 0) * 0.2
        );

        // Update article
        await supabase
          .from("news_articles")
          .update({
            relevance_score: result.relevance_score || 0,
            quality_score: result.quality_score || 0,
            timeliness_score: result.timeliness_score || 0,
            overall_score: overallScore,
            ai_summary: result.ai_summary || "",
            ai_insights: result.ai_insights || {},
            category: result.category || article.category,
          })
          .eq("id", article.id);

        // Cache result
        await supabase
          .from("ai_analysis_cache")
          .upsert({
            article_id: article.id,
            analysis_type: "scoring",
            analysis_result: {
              relevance_score: result.relevance_score,
              quality_score: result.quality_score,
              timeliness_score: result.timeliness_score,
              overall_score: overallScore,
              ai_summary: result.ai_summary,
              ai_insights: result.ai_insights,
            },
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
          });

        scored++;
      } catch (err) {
        console.error(`Error scoring article ${article.id}:`, err);
        continue;
      }
    }

    return new Response(
      JSON.stringify({ message: `Scored ${scored} articles` }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

