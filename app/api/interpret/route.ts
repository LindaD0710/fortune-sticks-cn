import { NextRequest, NextResponse } from 'next/server'
import { generateOraclePrompt } from '@/lib/ai-prompt'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { question, fortuneStick } = body

    if (!question || !fortuneStick) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || ''
    
    // Model configuration - supports fallback if primary model is unavailable
    // Try models in order: Claude 3.5 Sonnet -> GPT-4 -> DeepSeek -> GPT-3.5 Turbo
    // DeepSeek is added as it's widely available and cost-effective
    const MODELS = [
      'anthropic/claude-3.5-sonnet',
      'openai/gpt-4',
      'openai/gpt-4-turbo',
      'deepseek/deepseek-chat',  // DeepSeek Chat - widely available
      'deepseek/deepseek-coder', // DeepSeek Coder - alternative
      'openai/gpt-3.5-turbo',
    ]
    const selectedModel = process.env.OPENROUTER_MODEL || MODELS[0]
    
    if (!OPENROUTER_API_KEY) {
      // Return a mock interpretation for development
      return NextResponse.json({
        resonance: `The Silk has felt your query... Under the light of ${fortuneStick.levelEN || fortuneStick.level}, the threads of your fate are beginning to shimmer. The energy of Lot #${fortuneStick.number} resonates deeply with your question. The ancient legend of ${fortuneStick.storyEN || 'the Oracle'} speaks to this moment in your journey.`,
        weaving: `Regarding your question, the Oracle's guidance suggests a path of reflection and inner wisdom. The message reveals that ${fortuneStick.detail2EN || 'this is a time for thoughtful consideration'}. Trust in your ability to navigate this situation with grace. The ancient wisdom reminds us that every challenge carries within it the seed of growth and understanding.`,
        ritual: `Take 10 minutes each morning this week to write down three things you're grateful for, then reflect on how this practice shifts your perspective. This mindfulness exercise will help anchor the insights you've gained.`
      })
    }

    // Generate prompt using the prompt generator
    try {
      const userPrompt = generateOraclePrompt(fortuneStick, question)
      
      const systemPrompt = `You are the Lead Guide of "The Whispering Silk" (半夏). You are an expert in Eastern philosophy, psychological reflection, and personal growth. You use ancient wisdom and metaphors to inspire modern self-discovery, but always frame guidance in terms of psychology, mindfulness, and personal empowerment—never as supernatural, religious, or superstitious practices. Your language style is elegant, thoughtful, and deeply healing, focusing on self-awareness and emotional intelligence.`

      // Try calling OpenRouter API with model fallback
      let lastError: any = null
      let response: Response | null = null
      
      // Try models in order until one works
      for (const model of MODELS) {
        try {
          response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
              'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
              'X-Title': 'Oriental Oracle',
            },
            body: JSON.stringify({
              model: model,
              messages: [
                {
                  role: 'system',
                  content: systemPrompt,
                },
                {
                  role: 'user',
                  content: userPrompt,
                },
              ],
              temperature: 0.8,
              max_tokens: 1000,
            }),
          })
          
          // If successful, break out of loop
          if (response.ok) {
            console.log(`Successfully using model: ${model}`)
            break
          }
          
          // If 403 (region unavailable) or 404 (model not found), try next model
          if (response.status === 403 || response.status === 404) {
            let errorText = ''
            try {
              errorText = await response.text()
              // Try to parse as JSON for better error message
              try {
                const errorJson = JSON.parse(errorText)
                if (errorJson.error?.message) {
                  errorText = errorJson.error.message
                }
              } catch {
                // Not JSON, use as is
              }
            } catch {
              errorText = `Model unavailable (${response.status})`
            }
            console.warn(`Model ${model} unavailable (${response.status}): ${errorText}, trying next model...`)
            lastError = { status: response.status, message: errorText }
            response = null
            continue
          }
          
          // For other errors, break and handle
          break
        } catch (fetchError) {
          console.error(`Error calling model ${model}:`, fetchError)
          lastError = fetchError
          response = null
          continue
        }
      }
      
      // If all models failed, return error
      if (!response) {
        return NextResponse.json(
          { 
            error: 'All models unavailable',
            details: lastError?.message || 'None of the configured models are available in your region. Please try using a VPN or contact support.',
            suggestion: 'You can set OPENROUTER_MODEL in .env.local to specify a different model, or use a VPN to access region-restricted models.'
          },
          { status: 403 }
        )
      }

      if (!response.ok) {
        const errorData = await response.text()
        let errorMessage = 'Failed to generate interpretation'
        
        try {
          const errorJson = JSON.parse(errorData)
          errorMessage = errorJson.error?.message || errorJson.error || errorMessage
        } catch {
          // If not JSON, use the raw error text
          errorMessage = errorData || errorMessage
        }
        
        console.error('OpenRouter API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        })
        
        let details = ''
        if (response.status === 401) {
          details = 'Invalid API key. Please check your OPENROUTER_API_KEY in .env.local'
        } else if (response.status === 403) {
          details = 'This model is not available in your region. The system will try alternative models automatically.'
        } else if (response.status === 429) {
          details = 'Rate limit exceeded. Please try again later.'
        } else {
          details = `API returned status ${response.status}: ${errorMessage}`
        }
        
        return NextResponse.json(
          { 
            error: errorMessage,
            details: details
          },
          { status: response.status }
        )
      }

      const data = await response.json()
      let content = data.choices[0]?.message?.content || 'Unable to generate interpretation.'
      
      console.log('Raw AI response length:', content.length)
      console.log('Raw AI response preview:', content.substring(0, 300))
      
      // Clean up the content - remove markdown code blocks if present
      content = content.trim()
      
      // Remove markdown code block markers
      if (content.startsWith('```json')) {
        content = content.replace(/^```json\s*/i, '').replace(/\s*```$/m, '')
      } else if (content.startsWith('```')) {
        content = content.replace(/^```\s*/, '').replace(/\s*```$/m, '')
      }
      
      // Try to extract JSON object if it's embedded in text
      const jsonMatch = content.match(/\{[\s\S]*?"resonance"[\s\S]*?"weaving"[\s\S]*?"ritual"[\s\S]*?\}/)
      if (jsonMatch) {
        content = jsonMatch[0]
      }
      
      // Try to parse JSON response
      try {
        let parsed = JSON.parse(content.trim())
        console.log('Successfully parsed JSON, fields:', {
          hasResonance: !!parsed.resonance,
          hasWeaving: !!parsed.weaving,
          hasRitual: !!parsed.ritual,
          resonanceType: typeof parsed.resonance,
          resonancePreview: typeof parsed.resonance === 'string' ? parsed.resonance.substring(0, 50) : 'not a string'
        })
        
        // Clean up the parsed values - ensure they are pure text, not JSON structures
        const cleanText = (value: any, fieldName: string): string => {
          if (!value) return ''
          if (typeof value !== 'string') return String(value)
          
          let text = value.trim()
          
          // First, try to parse if it's a JSON string (nested JSON)
          if (text.startsWith('{') || text.startsWith('[')) {
            try {
              const parsed = JSON.parse(text)
              // If it's an object with the field we want, extract it
              if (typeof parsed === 'object' && parsed !== null) {
                if (parsed[fieldName] && typeof parsed[fieldName] === 'string') {
                  text = parsed[fieldName]
                } else if (parsed.resonance || parsed.weaving || parsed.ritual) {
                  // It's the full JSON object, extract the right field
                  if (fieldName === 'resonance' && parsed.resonance) text = parsed.resonance
                  else if (fieldName === 'weaving' && parsed.weaving) text = parsed.weaving
                  else if (fieldName === 'ritual' && parsed.ritual) text = parsed.ritual
                  else text = value // Fallback to original
                }
              }
            } catch {
              // Not valid JSON, continue with cleaning
            }
          }
          
          // Remove any JSON structure patterns that might be embedded
          // Remove patterns like: {"resonance": "...", "weaving": "..."}
          text = text.replace(/\{[^}]*"resonance"[^}]*\}/gi, '')
          text = text.replace(/\{[^}]*"weaving"[^}]*\}/gi, '')
          text = text.replace(/\{[^}]*"ritual"[^}]*\}/gi, '')
          
          // Remove field name patterns: "resonance": "..." or "weaving": "..."
          text = text.replace(new RegExp(`"${fieldName}"\\s*:\\s*"`, 'gi'), '')
          text = text.replace(new RegExp(`"resonance"\\s*:\\s*"`, 'gi'), '')
          text = text.replace(new RegExp(`"weaving"\\s*:\\s*"`, 'gi'), '')
          text = text.replace(new RegExp(`"ritual"\\s*:\\s*"`, 'gi'), '')
          
          // Remove JSON structure markers
          text = text
            .replace(/^\s*\{[\s\S]*?"(?:resonance|weaving|ritual)"\s*:\s*"?/, '') // Remove opening JSON
            .replace(/"?\s*,\s*"(?:resonance|weaving|ritual)"\s*:\s*"[\s\S]*$/, '') // Remove trailing fields
            .replace(/"?\s*\}[\s\S]*$/, '') // Remove closing brace
            .replace(/^["']|["']$/g, '') // Remove surrounding quotes
            .trim()
          
          // Remove any remaining JSON-like patterns with escaped quotes
          text = text.replace(/\\"/g, '"') // Unescape quotes
          text = text.replace(/\\n/g, '\n') // Unescape newlines
          
          // Final cleanup: remove any remaining JSON structure
          text = text.replace(/\{[^}]*\}/g, '').trim()
          
          // Remove any trailing JSON field references
          text = text.replace(/,\s*"[^"]+"\s*:\s*"[^"]+"\s*\}/g, '')
          text = text.replace(/\}\s*$/, '')
          
          return text.trim()
        }
        
        let cleanResonance = cleanText(parsed.resonance, 'resonance')
        let cleanWeaving = cleanText(parsed.weaving, 'weaving')
        let cleanRitual = cleanText(parsed.ritual, 'ritual')
        
        // Final validation: ensure no JSON structures remain
        // If any field still looks like JSON, try to extract the actual text
        const finalClean = (text: string): string => {
          if (!text) return text
          // If it still starts with { and contains field names, it's likely nested JSON
          if (text.trim().startsWith('{') && (text.includes('"resonance"') || text.includes('"weaving"') || text.includes('"ritual"'))) {
            try {
              const reParsed = JSON.parse(text)
              // Try to extract the actual content
              if (typeof reParsed === 'object') {
                // If it's the full object, we already handled it in cleanText
                // But if it's still here, try to get the first string value
                const values = Object.values(reParsed).filter(v => typeof v === 'string' && v.length > 10)
                if (values.length > 0) {
                  return String(values[0])
                }
              }
            } catch {
              // If parsing fails, remove JSON structure manually
              text = text.replace(/\{[^}]*"resonance"[^}]*\}/gi, '')
              text = text.replace(/\{[^}]*"weaving"[^}]*\}/gi, '')
              text = text.replace(/\{[^}]*"ritual"[^}]*\}/gi, '')
              text = text.replace(/["']\s*:\s*["']/g, '')
              text = text.replace(/[{}]/g, '')
            }
          }
          return text.trim()
        }
        
        cleanResonance = finalClean(cleanResonance)
        cleanWeaving = finalClean(cleanWeaving)
        cleanRitual = finalClean(cleanRitual)
        
        console.log('Cleaned fields:', {
          resonanceLength: cleanResonance.length,
          weavingLength: cleanWeaving.length,
          ritualLength: cleanRitual.length,
          resonancePreview: cleanResonance.substring(0, 100),
          weavingPreview: cleanWeaving.substring(0, 100),
          ritualPreview: cleanRitual.substring(0, 100)
        })
        
        // Check if we have at least resonance (most important)
        if (cleanResonance && cleanResonance.length > 10) {
          // Return with defaults for missing fields
          return NextResponse.json({
            resonance: cleanResonance,
            weaving: cleanWeaving && cleanWeaving.length > 10 ? cleanWeaving : 'The Oracle weaves its wisdom through the threads of fate...',
            ritual: cleanRitual && cleanRitual.length > 10 ? cleanRitual : 'Take a moment of quiet reflection to connect with this guidance.'
          })
        }
      } catch (e) {
        // If not JSON, try to extract meaningful content
        console.warn('Failed to parse JSON response, content:', content.substring(0, 200))
        
        // Try to split content into three parts if it's a long text
        if (content.length > 100) {
          const parts = content.split(/\n\n+/)
          return NextResponse.json({
            resonance: parts[0] || content.substring(0, Math.floor(content.length / 3)),
            weaving: parts[1] || content.substring(Math.floor(content.length / 3), Math.floor(content.length * 2 / 3)),
            ritual: parts[2] || content.substring(Math.floor(content.length * 2 / 3)) || 'Take a moment of quiet reflection to connect with this guidance.'
          })
        }
        
        // Fallback: return content as resonance
        return NextResponse.json({
          resonance: content,
          weaving: 'The Oracle continues to weave its wisdom through the threads of your fate...',
          ritual: 'Take a moment of quiet reflection to connect with this guidance.'
        })
      }

      // If parsing succeeded but structure is wrong
      return NextResponse.json({
        resonance: content || 'The energy resonates with your question...',
        weaving: 'The Oracle weaves its wisdom through the threads of fate...',
        ritual: 'Take a moment of quiet reflection to connect with this guidance.'
      })
    } catch (promptError) {
      console.error('Error generating prompt or calling API:', promptError)
      return NextResponse.json(
        { 
          error: 'Failed to generate prompt or call API',
          details: promptError instanceof Error ? promptError.message : 'Unknown error occurred'
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Interpretation error:', error)
    const errorMessage = error instanceof Error ? error.message : 'An error occurred'
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error && error.message.includes('fetch') 
          ? 'Network error. Please check your internet connection and try again.'
          : errorMessage
      },
      { status: 500 }
    )
  }
}
