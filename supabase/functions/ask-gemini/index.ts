// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
  "Content-Type": "application/json"
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid prompt' }), { status: 400, headers: corsHeaders });
    }

    const apiKey = Deno.env.get('GEMINI_API_KEY');
    // Use current stable models: gemini-2.5-flash (best price-performance) or gemini-2.5-pro
    let model = (Deno.env.get('GEMINI_MODEL') || 'gemini-2.5-flash').trim();
    if (model.startsWith('models/')) model = model.replace(/^models\//, '');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'GEMINI_API_KEY not configured' }), { status: 500, headers: corsHeaders });
    }

    // Try models in order: user's model → gemini-2.5-flash → gemini-2.5-flash-lite → gemini-2.5-pro
    const fallbackModels = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.5-pro'];
    let responseText = '';
    let resp;
    let lastError = null;
    let success = false;
    
    for (const tryModel of [model, ...fallbackModels.filter(m => m !== model)]) {
      // Try v1beta first
      let url = `https://generativelanguage.googleapis.com/v1beta/models/${tryModel}:generateContent?key=${apiKey}`;
      resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      
      // If 404, try v1 API
      if (resp.status === 404) {
        url = `https://generativelanguage.googleapis.com/v1/models/${tryModel}:generateContent?key=${apiKey}`;
        resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
      }
      
      // Read response text
      responseText = await resp.text();
      if (resp.ok && responseText && responseText.trim()) {
        // Success - break out of loop
        success = true;
        break;
      }
      lastError = { status: resp.status, text: responseText.substring(0, 200), model: tryModel };
    }
    if (!success || !responseText || responseText.trim() === '') {
      const errorInfo = lastError || { status: resp?.status || 500, model: model };
      console.error('Gemini API failed:', errorInfo);
      return new Response(JSON.stringify({ 
        error: 'Gemini API error', 
        details: `HTTP ${errorInfo.status}. Tried models: ${[model, ...fallbackModels].join(', ')}. Error: ${errorInfo.text || 'Unknown'}. Check your API key and model names.` 
      }), { status: 500, headers: corsHeaders });
    }
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      return new Response(JSON.stringify({ error: 'Invalid JSON from Gemini API', details: responseText.substring(0, 200) }), { status: 500, headers: corsHeaders });
    }
    
    if (!resp.ok) {
      return new Response(JSON.stringify({ error: 'Gemini error', details: data }), { status: resp.status, headers: corsHeaders });
    }
    return new Response(JSON.stringify(data), { headers: corsHeaders });
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : String(e);
    console.error('Edge Function error:', errorMsg);
    return new Response(JSON.stringify({ error: 'Edge Function error', details: errorMsg }), { status: 400, headers: corsHeaders });
  }
});

