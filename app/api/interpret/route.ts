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
      // Return a mock interpretation for development (in Chinese)
      return NextResponse.json({
        insight: `签文已感受到你的问题...在"${fortuneStick.level}"的指引下，命运的线索开始闪烁。第${fortuneStick.number}签的能量与你的问题产生了深刻共鸣。**这份签文提醒你，当前的问题背后可能隐藏着成长的机会。**`,
        guidance: `针对你的问题，签文的指引建议你走一条反思和内在智慧的道路。**信任你以优雅的方式应对这个情况的能力。**古老的智慧提醒我们，每一个挑战都蕴含着成长和理解的种子。`,
        practice: `本周每天早晨花10分钟写下三件你感激的事情，然后反思这个练习如何改变你的视角。`
      })
    }

    // Generate prompt using the prompt generator
    try {
      const userPrompt = generateOraclePrompt(fortuneStick, question)
      
      const systemPrompt = `你是"关帝灵签"的智慧解读师。你精通东方哲学、心理学反思和个人成长指导。你的语调优雅、深思熟虑、富有治愈力，有文学性和画面感。你使用古代故事的隐喻和智慧来启发现代自我反思，但始终以心理学、正念和个人赋能为框架——绝不涉及超自然或宗教实践。

【核心原则】：
1. 你必须针对用户的具体问题提供个性化解读，不能给出通用解读
2. 你必须将签诗的每个关键意象都映射到用户的具体问题上
3. 你必须用比喻和类比来解释签文，让用户产生共鸣
4. 你必须给出明确的心理状态描述、时间暗示、答案方向
5. 你的解读必须丰富、翔实、有深度，有画面感，让用户感到被理解和支持

【解读风格】：
- 优雅、有文学性，用词精准
- 既有古签的韵味，又有现代心理学的洞察
- 用比喻和类比来解释（如"如久旱逢甘霖"、"如干涸的田地"）
- 让用户产生共鸣，感到被理解和支持`

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
              temperature: 0.7,
              max_tokens: 2000,
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
      
      // Try to extract JSON object if it's embedded in text (support both old and new field names)
      const jsonMatch = content.match(/\{[\s\S]*?"(?:resonance|insight)"[\s\S]*?"(?:weaving|guidance)"[\s\S]*?"(?:ritual|practice)"[\s\S]*?\}/)
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
          hasInsight: !!parsed.insight,
          hasGuidance: !!parsed.guidance,
          hasPractice: !!parsed.practice,
          insightType: typeof parsed.insight,
          insightPreview: typeof parsed.insight === 'string' ? parsed.insight.substring(0, 50) : 'not a string'
        })
        
        // Clean up the parsed values - ensure they are pure text, not JSON structures
        const cleanText = (value: any, fieldName: string): string => {
          if (!value) return ''
          if (typeof value !== 'string') {
            // If it's not a string, convert to string
            return String(value)
          }
          
          let text = value.trim()
          
          // If empty after trim, return empty
          if (!text) return ''
          
          // First, try to parse if it's a JSON string (nested JSON)
          if (text.startsWith('{') || text.startsWith('[')) {
            try {
              const nestedParsed = JSON.parse(text)
              // If it's an object, try to extract the actual content
              if (typeof nestedParsed === 'object' && nestedParsed !== null) {
                // Check for the field we want first
                if (nestedParsed[fieldName] && typeof nestedParsed[fieldName] === 'string') {
                  text = nestedParsed[fieldName]
                } 
                // Check for old field names
                else if (fieldName === 'insight' && nestedParsed.resonance && typeof nestedParsed.resonance === 'string') {
                  text = nestedParsed.resonance
                }
                else if (fieldName === 'guidance' && nestedParsed.weaving && typeof nestedParsed.weaving === 'string') {
                  text = nestedParsed.weaving
                }
                else if (fieldName === 'practice' && nestedParsed.ritual && typeof nestedParsed.ritual === 'string') {
                  text = nestedParsed.ritual
                }
                // If it's the full JSON object with all fields, extract the right one
                else if (nestedParsed.insight || nestedParsed.guidance || nestedParsed.practice) {
                  if (fieldName === 'insight' && nestedParsed.insight) text = nestedParsed.insight
                  else if (fieldName === 'guidance' && nestedParsed.guidance) text = nestedParsed.guidance
                  else if (fieldName === 'practice' && nestedParsed.practice) text = nestedParsed.practice
                  else text = value // Fallback to original
                }
                // If none of the above, try to get the first meaningful string value
                else {
                  const values = Object.values(nestedParsed).filter(v => typeof v === 'string' && v.length > 10)
                  if (values.length > 0) {
                    text = String(values[0])
                  }
                }
              }
            } catch {
              // Not valid JSON, continue with cleaning
            }
          }
          
          // CRITICAL: If text contains JSON field patterns, extract content immediately
          // This handles cases like: "{ "insight": "当前状态:" }" or "insight": "当前状态:"
          // We need to match the pattern that includes the colon and extract everything after the first quote
          if (text.includes('"insight"') || text.includes('"guidance"') || text.includes('"practice"') || 
              text.includes('"resonance"') || text.includes('"weaving"') || text.includes('"ritual"')) {
            
            // Pattern 1: Match { "insight": "content..." } - extract everything inside the quotes
            // This regex matches: { "insight": " and captures everything until the closing quote
            const fullJsonMatch = text.match(/\{\s*["']?(?:insight|guidance|practice|resonance|weaving|ritual)\s*["']?\s*[:：]\s*["']((?:[^"\\]|\\.|"")*?)["']/)
            if (fullJsonMatch && fullJsonMatch[1]) {
              text = fullJsonMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\t/g, ' ').replace(/""/g, '"')
            } else {
              // Pattern 2: Match "insight": "content..." - simpler pattern without braces
              const simpleMatch = text.match(/["']?(?:insight|guidance|practice|resonance|weaving|ritual)\s*["']?\s*[:：]\s*["']((?:[^"\\]|\\.|"")*?)["']/)
              if (simpleMatch && simpleMatch[1]) {
                text = simpleMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\t/g, ' ').replace(/""/g, '"')
              } else {
                // Pattern 3: More aggressive - find the first quote after the field name and extract until matching quote
                // This handles cases where quotes might be escaped or nested
                const aggressiveMatch = text.match(/[:：]\s*["']([^"']*(?:["'][^"']*)*)["']/)
                if (aggressiveMatch && aggressiveMatch[1]) {
                  text = aggressiveMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\t/g, ' ')
                }
              }
            }
          }
          
          // Remove any JSON structure patterns that might be embedded
          // Remove patterns like: {"insight": "...", "guidance": "..."} or {"resonance": "...", "weaving": "..."}
          text = text.replace(/\{[^}]*"(?:insight|resonance)"[^}]*\}/gi, '')
          text = text.replace(/\{[^}]*"(?:guidance|weaving)"[^}]*\}/gi, '')
          text = text.replace(/\{[^}]*"(?:practice|ritual)"[^}]*\}/gi, '')
          
          // Remove field name patterns: "insight": "..." or "resonance": "..." etc.
          const fieldPatterns = [
            `"${fieldName}"\\s*:\\s*"`,
            `"insight"\\s*:\\s*"`,
            `"guidance"\\s*:\\s*"`,
            `"practice"\\s*:\\s*"`,
            `"resonance"\\s*:\\s*"`,
            `"weaving"\\s*:\\s*"`,
            `"ritual"\\s*:\\s*"`
          ]
          
          fieldPatterns.forEach(pattern => {
            text = text.replace(new RegExp(pattern, 'gi'), '')
          })
          
          // Remove JSON structure markers more aggressively
          text = text
            .replace(/^\s*\{[\s\S]*?"(?:insight|resonance|guidance|weaving|practice|ritual)"\s*:\s*"?/, '') // Remove opening JSON
            .replace(/"?\s*,\s*"(?:insight|resonance|guidance|weaving|practice|ritual)"\s*:\s*"[\s\S]*$/, '') // Remove trailing fields
            .replace(/"?\s*\}[\s\S]*$/, '') // Remove closing brace
            .replace(/^["']|["']$/g, '') // Remove surrounding quotes
            .trim()
          
          // Remove any remaining JSON-like patterns with escaped quotes
          text = text.replace(/\\"/g, '"') // Unescape quotes
          text = text.replace(/\\n/g, '\n') // Unescape newlines
          text = text.replace(/\\t/g, ' ') // Unescape tabs
          
          // Final cleanup: remove any remaining JSON structure
          text = text.replace(/\{[^}]*\}/g, '').trim()
          text = text.replace(/\[[^\]]*\]/g, '').trim()
          
          // Remove any trailing JSON field references
          text = text.replace(/,\s*"[^"]+"\s*:\s*"[^"]+"\s*\}/g, '')
          text = text.replace(/\}\s*$/, '')
          text = text.replace(/\{\s*$/, '')
          
          // Remove field names that might appear as plain text
          text = text.replace(/^\s*(?:insight|guidance|practice|resonance|weaving|ritual)\s*:\s*/i, '')
          
          return text.trim()
        }
        
        // Extract and clean fields - prioritize new field names, fallback to old ones
        let cleanInsight = ''
        let cleanGuidance = ''
        let cleanPractice = ''
        
        // Try new field names first
        if (parsed.insight) {
          cleanInsight = cleanText(parsed.insight, 'insight')
        } else if (parsed.resonance) {
          cleanInsight = cleanText(parsed.resonance, 'resonance')
        }
        
        if (parsed.guidance) {
          cleanGuidance = cleanText(parsed.guidance, 'guidance')
        } else if (parsed.weaving) {
          cleanGuidance = cleanText(parsed.weaving, 'weaving')
        }
        
        if (parsed.practice) {
          cleanPractice = cleanText(parsed.practice, 'practice')
        } else if (parsed.ritual) {
          cleanPractice = cleanText(parsed.ritual, 'ritual')
        }
        
        // Final validation: ensure no JSON structures remain
        const finalClean = (text: string): string => {
          if (!text) return text
          
          // First, try to parse if the entire text is a JSON object
          if (text.trim().startsWith('{') && text.trim().endsWith('}')) {
            try {
              const parsed = JSON.parse(text.trim())
              // If it's an object, try to extract the actual content
              if (typeof parsed === 'object' && parsed !== null) {
                // Try to find the actual content field
                if (parsed.insight && typeof parsed.insight === 'string') {
                  text = parsed.insight
                } else if (parsed.guidance && typeof parsed.guidance === 'string') {
                  text = parsed.guidance
                } else if (parsed.practice && typeof parsed.practice === 'string') {
                  text = parsed.practice
                } else if (parsed.resonance && typeof parsed.resonance === 'string') {
                  text = parsed.resonance
                } else if (parsed.weaving && typeof parsed.weaving === 'string') {
                  text = parsed.weaving
                } else if (parsed.ritual && typeof parsed.ritual === 'string') {
                  text = parsed.ritual
                } else {
                  // Get the first string value
                  const values = Object.values(parsed).filter(v => typeof v === 'string' && v.length > 10)
                  if (values.length > 0) {
                    text = String(values[0])
                  }
                }
              }
            } catch {
              // Not valid JSON, continue with other cleanup
            }
          }
          
          // If it still looks like JSON, try one more aggressive cleanup
          if (text.trim().startsWith('{') || text.includes('"insight"') || text.includes('"guidance"') || text.includes('"practice"') || 
              text.includes('"resonance"') || text.includes('"weaving"') || text.includes('"ritual"')) {
            // Try multiple patterns to extract the actual content
            // Pattern 1: "insight": "content" or "insight": 'content'
            const pattern1 = text.match(/["']?\s*(?:insight|guidance|practice|resonance|weaving|ritual)\s*["']?\s*[:：]\s*["']((?:[^"\\]|\\.)*)["']/)
            if (pattern1 && pattern1[1]) {
              text = pattern1[1].replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\t/g, ' ').replace(/\\'/g, "'")
            } else {
              // Pattern 2: Try to extract text between quotes after field names (handle escaped quotes)
              const quoteMatch = text.match(/:\s*"((?:[^"\\]|\\.)*)"/)
              if (quoteMatch && quoteMatch[1]) {
                text = quoteMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\t/g, ' ')
              } else {
                // Pattern 3: Remove all JSON structure more aggressively
                text = text.replace(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g, '')
                text = text.replace(/["']/g, '')
                text = text.replace(/^\s*(?:insight|guidance|practice|resonance|weaving|ritual)\s*:\s*/i, '')
              }
            }
          }
          
          // Remove any remaining JSON-like patterns
          text = text.replace(/\{[^}]*\}/g, '')
          text = text.replace(/\[[^\]]*\]/g, '')
          
          // Remove JSON field patterns like "insight": "..." or "insight": "..."
          // This handles cases where the text starts with a field name
          text = text.replace(/^["']?\s*(?:insight|guidance|practice|resonance|weaving|ritual)\s*["']?\s*[:：]\s*["']?/i, '')
          text = text.replace(/\s*["']?\s*(?:insight|guidance|practice|resonance|weaving|ritual)\s*["']?\s*[:：]\s*["']?/gi, ' ')
          
          // Remove any remaining JSON field patterns with quotes like "insight": or "guidance":
          text = text.replace(/"\s*(?:insight|guidance|practice|resonance|weaving|ritual)\s*"\s*[:：]\s*/gi, '')
          text = text.replace(/'\s*(?:insight|guidance|practice|resonance|weaving|ritual)\s*'\s*[:：]\s*/gi, '')
          
          // Remove leading/trailing quotes that might be left
          text = text.replace(/^["']+|["']+$/g, '')
          
          // Final pass: remove any remaining field name references at the start
          text = text.replace(/^\s*(?:insight|guidance|practice|resonance|weaving|ritual)\s*[:：]\s*/i, '')
          text = text.replace(/\s*(?:insight|guidance|practice|resonance|weaving|ritual)\s*[:：]\s*/gi, ' ')
          
          return text.trim()
        }
        
        cleanInsight = finalClean(cleanInsight)
        cleanGuidance = finalClean(cleanGuidance)
        cleanPractice = finalClean(cleanPractice)
        
        // Final check: if still contains JSON patterns like "{ "insight": "..." }", extract content
        if (cleanInsight.includes('"insight"') || cleanInsight.includes('"guidance"') || cleanInsight.includes('"practice"')) {
          console.warn('Warning: insight still contains JSON patterns, applying additional cleanup')
          // Try to extract content from patterns like "{ "insight": "content" }" or "insight": "content"
          const match1 = cleanInsight.match(/\{\s*["']?(?:insight|guidance|practice)\s*["']?\s*[:：]\s*["']((?:[^"\\]|\\.)*)["']/)
          if (match1 && match1[1]) {
            cleanInsight = match1[1].replace(/\\"/g, '"').replace(/\\n/g, '\n')
          } else {
            const match2 = cleanInsight.match(/["']?(?:insight|guidance|practice)\s*["']?\s*[:：]\s*["']((?:[^"\\]|\\.)*)["']/)
            if (match2 && match2[1]) {
              cleanInsight = match2[1].replace(/\\"/g, '"').replace(/\\n/g, '\n')
            }
          }
        }
        if (cleanGuidance.includes('"insight"') || cleanGuidance.includes('"guidance"') || cleanGuidance.includes('"practice"')) {
          console.warn('Warning: guidance still contains JSON patterns, applying additional cleanup')
          const match1 = cleanGuidance.match(/\{\s*["']?(?:insight|guidance|practice)\s*["']?\s*[:：]\s*["']((?:[^"\\]|\\.)*)["']/)
          if (match1 && match1[1]) {
            cleanGuidance = match1[1].replace(/\\"/g, '"').replace(/\\n/g, '\n')
          } else {
            const match2 = cleanGuidance.match(/["']?(?:insight|guidance|practice)\s*["']?\s*[:：]\s*["']((?:[^"\\]|\\.)*)["']/)
            if (match2 && match2[1]) {
              cleanGuidance = match2[1].replace(/\\"/g, '"').replace(/\\n/g, '\n')
            }
          }
        }
        if (cleanPractice.includes('"insight"') || cleanPractice.includes('"guidance"') || cleanPractice.includes('"practice"')) {
          console.warn('Warning: practice still contains JSON patterns, applying additional cleanup')
          const match1 = cleanPractice.match(/\{\s*["']?(?:insight|guidance|practice)\s*["']?\s*[:：]\s*["']((?:[^"\\]|\\.)*)["']/)
          if (match1 && match1[1]) {
            cleanPractice = match1[1].replace(/\\"/g, '"').replace(/\\n/g, '\n')
          } else {
            const match2 = cleanPractice.match(/["']?(?:insight|guidance|practice)\s*["']?\s*[:：]\s*["']((?:[^"\\]|\\.)*)["']/)
            if (match2 && match2[1]) {
              cleanPractice = match2[1].replace(/\\"/g, '"').replace(/\\n/g, '\n')
            }
          }
        }
        
        console.log('Cleaned fields:', {
          insightLength: cleanInsight.length,
          guidanceLength: cleanGuidance.length,
          practiceLength: cleanPractice.length,
          insightPreview: cleanInsight.substring(0, 200),
          guidancePreview: cleanGuidance.substring(0, 200),
          practicePreview: cleanPractice.substring(0, 200),
          insightHasJson: cleanInsight.includes('"insight"') || cleanInsight.includes('"guidance"') || cleanInsight.includes('"practice"'),
          guidanceHasJson: cleanGuidance.includes('"insight"') || cleanGuidance.includes('"guidance"') || cleanGuidance.includes('"practice"'),
          practiceHasJson: cleanPractice.includes('"insight"') || cleanPractice.includes('"guidance"') || cleanPractice.includes('"practice"')
        })
        
        // Check if we have at least insight/resonance (most important)
        if (cleanInsight && cleanInsight.length > 10) {
          // Return with new field names, with fallbacks for missing fields
          return NextResponse.json({
            insight: cleanInsight,
            guidance: cleanGuidance && cleanGuidance.length > 10 ? cleanGuidance : '签文的智慧提醒我们，每一个挑战都蕴含着成长的机会。信任你内在的智慧，以优雅的方式应对当前的情况。',
            practice: cleanPractice && cleanPractice.length > 10 ? cleanPractice : '本周每天花10分钟静心反思，写下你的感受和想法，这将帮助你更好地理解当前的情况。'
          })
        }
      } catch (e) {
        // If not JSON, try to extract meaningful content
        console.warn('Failed to parse JSON response, content:', content.substring(0, 200))
        
        // Try to split content into three parts if it's a long text
        if (content.length > 100) {
          const parts = content.split(/\n\n+/)
          return NextResponse.json({
            insight: parts[0] || content.substring(0, Math.floor(content.length / 3)),
            guidance: parts[1] || content.substring(Math.floor(content.length / 3), Math.floor(content.length * 2 / 3)),
            practice: parts[2] || content.substring(Math.floor(content.length * 2 / 3)) || '本周每天花10分钟静心反思，写下你的感受和想法。'
          })
        }
        
        // Fallback: return content as insight
        return NextResponse.json({
          insight: content,
          guidance: '签文的智慧提醒我们，每一个挑战都蕴含着成长的机会。信任你内在的智慧，以优雅的方式应对当前的情况。',
          practice: '本周每天花10分钟静心反思，写下你的感受和想法，这将帮助你更好地理解当前的情况。'
        })
      }

      // If parsing succeeded but structure is wrong
      return NextResponse.json({
        insight: content || '签文已感受到你的问题，能量正在与你的问题产生共鸣...',
        guidance: '签文的智慧提醒我们，每一个挑战都蕴含着成长的机会。信任你内在的智慧，以优雅的方式应对当前的情况。',
        practice: '本周每天花10分钟静心反思，写下你的感受和想法，这将帮助你更好地理解当前的情况。'
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
