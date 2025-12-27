// Vector Embedder Edge Function
// Generates vector embeddings for articles using OpenAI text-embedding-3-small
// Stores embeddings in PostgreSQL vector format

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

    // Get articles without embeddings (limit to 20 per run)
    const { data: articles, error } = await supabase
      .from("news_articles")
      .select("*")
      .is("embedding", null)
      .limit(20)
      .order("published_at", { ascending: false });

    if (error) throw error;
    if (!articles || articles.length === 0) {
      return new Response(
        JSON.stringify({ message: "No articles to embed" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    let embedded = 0;
    for (const article of articles) {
      try {
        // Create embedding text (title + summary + category)
        const embeddingText = `${article.title}\n${article.summary || ""}\nCategory: ${article.category}`;

        // Generate embedding
        const embeddingResponse = await openai.embeddings.create({
          model: "text-embedding-3-small", // 1536 dimensions
          input: embeddingText,
        });

        const embedding = embeddingResponse.data[0].embedding;

        // Convert array to PostgreSQL vector format: [1,2,3,...]
        const vectorString = `[${embedding.join(",")}]`;

        // Update article with embedding
        // Note: If direct update fails, use the RPC function update_article_embedding
        const { error: updateError } = await supabase
          .from("news_articles")
          .update({
            embedding: vectorString,
            embedding_model: "text-embedding-3-small",
            embedding_generated_at: new Date().toISOString(),
          })
          .eq("id", article.id);

        // If direct update fails (vector type casting issue), try RPC function
        if (updateError) {
          console.warn('Direct update failed, trying RPC function:', updateError);
          const { error: rpcError } = await supabase.rpc('update_article_embedding', {
            p_article_id: article.id,
            p_embedding: vectorString,
            p_model: 'text-embedding-3-small'
          });
          
          if (rpcError) {
            throw rpcError;
          }
        }

        embedded++;
      } catch (err) {
        console.error(`Error embedding article ${article.id}:`, err);
        continue;
      }
    }

    return new Response(
      JSON.stringify({ message: `Generated embeddings for ${embedded} articles` }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

