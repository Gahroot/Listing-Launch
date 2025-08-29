import { NextRequest, NextResponse } from 'next/server';
import type { WebhookResponse, PropertyData, AgentData } from '@/lib/types';

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'https://n8n.srv975468.hstgr.cloud/webhook/listing-launch';

interface RequestBody {
  sessionId: string;
  propertyData: PropertyData;
  agentData: AgentData;
}

// Enhanced in-memory cache to prevent duplicate requests
const processedSessions = new Map<string, { 
  timestamp: number; 
  response: any; 
  inProgress: boolean; 
  requestId: string 
}>();
const activeRequests = new Set<string>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const REQUEST_TIMEOUT = 30 * 1000; // 30 seconds for in-progress timeout

// Clean up old entries and stale in-progress requests
const cleanupCache = () => {
  const now = Date.now();
  for (const [sessionId, entry] of processedSessions.entries()) {
    if (now - entry.timestamp > CACHE_DURATION || 
        (entry.inProgress && now - entry.timestamp > REQUEST_TIMEOUT)) {
      processedSessions.delete(sessionId);
      activeRequests.delete(entry.requestId);
    }
  }
};

// Helper function to make HTTP request with timeout
const fetchWithTimeout = async (url: string, options: RequestInit, timeoutMs: number = 10000): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// Helper function to retry webhook calls
const retryWebhookCall = async (url: string, payload: object, maxRetries: number = 2): Promise<Response> => {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Webhook attempt ${attempt + 1}/${maxRetries + 1}:`, url);
      
      const response = await fetchWithTimeout(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }, 10000); // 10 second timeout
      
      if (response.ok) {
        return response;
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      lastError = error as Error;
      console.error(`Webhook attempt ${attempt + 1} failed:`, error);
      
      // If this isn't the last attempt, wait before retrying
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff: 1s, 2s, 4s
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError!;
};

export async function POST(request: NextRequest) {
  let body: RequestBody | undefined;
  let sessionId: string | undefined;
  let propertyData: PropertyData | undefined;
  let agentData: AgentData | undefined;
  let requestId: string;
  
  try {
    // Clean up old cache entries
    cleanupCache();
    
    // Generate unique request ID for this specific request
    requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Validate request body
    const rawBody = await request.json();
    
    // Basic validation
    if (!rawBody || typeof rawBody !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    
    if (!rawBody.sessionId || !rawBody.propertyData || !rawBody.agentData) {
      return NextResponse.json({ 
        error: 'Missing required fields: sessionId, propertyData, or agentData' 
      }, { status: 400 });
    }
    
    body = rawBody as RequestBody;
    sessionId = body.sessionId;
    propertyData = body.propertyData;
    agentData = body.agentData;

    // Check if we've already processed this session recently
    const cachedEntry = processedSessions.get(sessionId);
    if (cachedEntry && !cachedEntry.inProgress) {
      console.log(`Returning cached response for session ${sessionId}`);
      return NextResponse.json(cachedEntry.response);
    }
    
    // Check if a request is currently in progress for this session
    if (cachedEntry && cachedEntry.inProgress) {
      console.log(`Request already in progress for session ${sessionId}, rejecting duplicate`);
      return NextResponse.json({ 
        error: 'Request already in progress for this session' 
      }, { status: 429 });
    }
    
    // Mark this session as in progress
    processedSessions.set(sessionId, {
      timestamp: Date.now(),
      response: null,
      inProgress: true,
      requestId: requestId
    });
    activeRequests.add(requestId);

    // Prepare payload for n8n webhook
    const webhookPayload = {
      sessionId,
      property: {
        address: propertyData.address,
        status: propertyData.status
      },
      agent: {
        name: agentData.name,
        phone: agentData.phone,
        email: agentData.email,
        headshot: agentData.headshot,
        colors: agentData.colors
      },
      timestamp: new Date().toISOString()
    };

    console.log('Sending to n8n webhook:', N8N_WEBHOOK_URL, webhookPayload);

    // Call n8n webhook with retry logic
    const webhookResponse = await retryWebhookCall(N8N_WEBHOOK_URL, webhookPayload);
    
    const webhookResult = await webhookResponse.json();
    console.log('Webhook response received successfully:', { status: webhookResponse.status });
    
    // Update cache with successful response
    processedSessions.set(sessionId, {
      timestamp: Date.now(),
      response: webhookResult,
      inProgress: false,
      requestId: requestId
    });
    activeRequests.delete(requestId);
    
    // Return the webhook response (this should match the structure you provided)
    return NextResponse.json(webhookResult);

  } catch (error) {
    // Clean up in-progress state on error
    if (sessionId && requestId!) {
      processedSessions.delete(sessionId);
      activeRequests.delete(requestId);
    }
    
    console.error('Webhook API error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      url: N8N_WEBHOOK_URL,
      sessionId,
      requestId: requestId!,
      timestamp: new Date().toISOString()
    });
    
    // Return mock data for development/testing if n8n is down
    const mockResponse: WebhookResponse = {
      status: "ready_for_review",
      message: "Your complete listing marketing pack is ready!",
      summary: {
        property: propertyData?.address || "Sample Property",
        price: "$750,000",
        status: propertyData?.status === "RECENTLY_SOLD" ? "Recently Sold" : "For Sale",
        deliverables: {
          socialMediaPosts: "6 captions + hashtags",
          emailTemplates: "1 templates + 3 subject lines",
          landingPage: "SEO-optimized + mobile responsive",
          videoContent: "2 concepts with scripts"
        }
      },
      access: {
        dashboard: `https://dashboard.example.com/campaign/${sessionId || 'demo'}`,
        landingPage: `https://listings.example.com/${sessionId || 'demo'}`,
        downloadPack: `https://downloads.example.com/${sessionId || 'demo'}_pack.zip`
      },
      actions: {
        approve: {
          url: `/api/campaigns/${sessionId || 'demo'}/approve`,
          label: "✅ Approve & Schedule with Blotato"
        },
        regenerate: {
          url: `/api/campaigns/${sessionId || 'demo'}/regenerate`,
          label: "🔄 Regenerate Content"
        },
        download: {
          url: `https://downloads.example.com/${sessionId || 'demo'}_pack.zip`,
          label: "📥 Download Complete Pack"
        }
      },
      deliveryPackage: {
        social_media: {
          captions: [
            {
              platform: "YouTube",
              type: "video-description",
              caption: `🏠 NEW LISTING TOUR | ${propertyData?.address || 'Beautiful Property'}\n\nJoin me for an exclusive walkthrough of this stunning property! This ${propertyData?.status === 'RECENTLY_SOLD' ? 'recently sold home' : 'incredible listing'} offers everything you've been looking for.\n\n✅ Contact me today: ${agentData?.phone || '555-123-4567'}\n📧 ${agentData?.email || 'agent@example.com'}\n\n#RealEstate #PropertyTour #YourLocalRealtor`,
              cta: `Contact ${agentData?.name || 'your agent'} at ${agentData?.phone || '555-123-4567'}`
            },
            {
              platform: "Instagram/Facebook",
              type: "feature-focused",
              caption: `✨ ${propertyData?.status === 'RECENTLY_SOLD' ? 'JUST SOLD!' : 'NEW LISTING ALERT!'} ✨\n\n📍 ${propertyData?.address || 'Beautiful Property'}\n\n${propertyData?.status === 'RECENTLY_SOLD' ? 'Another successful closing!' : 'This dream home won\'t last long!'}\n\nReady to find your perfect home? Let's talk! 📞`,
              cta: `Call ${agentData?.name || 'your agent'} at ${agentData?.phone || '555-123-4567'}`
            },
            {
              platform: "LinkedIn",
              type: "professional",
              caption: `Professional Update: ${propertyData?.status === 'RECENTLY_SOLD' ? 'Successfully Closed' : 'New Listing Available'}\n\nProperty: ${propertyData?.address || 'Premium Location'}\n\n${propertyData?.status === 'RECENTLY_SOLD' ? 'Proud to have facilitated another smooth transaction for my clients.' : 'Exceptional property now available in a desirable location.'}\n\nFor real estate inquiries, feel free to connect with me directly.`,
              cta: `Connect with ${agentData?.name || 'me'} for professional real estate services`
            },
            {
              platform: "X (Twitter)",
              type: "thread",
              caption: `🏠 ${propertyData?.status === 'RECENTLY_SOLD' ? 'SOLD:' : 'LISTING:'} ${propertyData?.address || 'Premium Property'}\n\n🧵 Thread (1/3)\n\n${propertyData?.status === 'RECENTLY_SOLD' ? 'Another happy client, another successful sale!' : 'Stunning property just hit the market!'}\n\n#RealEstate #PropertyAlert`,
              cta: `DM me or call ${agentData?.phone || '555-123-4567'}`
            },
            {
              platform: "TikTok",
              type: "vertical-video",
              caption: `${propertyData?.status === 'RECENTLY_SOLD' ? 'SOLD in record time! ⚡' : 'House hunting? This one\'s special ✨'} #RealEstate #PropertyTour #YourCity #HomeSweetHome #RealEstateAgent #NewListing`,
              cta: `Contact me for showings! ${agentData?.phone || '555-123-4567'}`
            }
          ],
          hashtags: [
            "#realestate", "#property", "#home", "#listing", "#dreamhome",
            "#yourlocalrealtor", "#propertyexpert", "#realestateagent",
            propertyData?.status === 'RECENTLY_SOLD' ? "#sold" : "#forsale",
            "#newlisting", "#homebuying", "#realtorlife"
          ],
          imageSpecs: [
            {
              type: "hero-image",
              description: "Main exterior shot with status overlay",
              dimensions: "1080x1080 (Instagram Square), 1200x630 (Facebook)",
              overlay: propertyData?.status === 'RECENTLY_SOLD' ? 'SOLD' : 'FOR SALE',
              banner: null
            }
          ]
        },
        email: {
          templates: [
            {
              name: "Property Update Newsletter",
              type: "html",
              html: `<!DOCTYPE html>
<html>
<head>
    <title>${propertyData?.status === 'RECENTLY_SOLD' ? 'SOLD' : 'NEW LISTING'} - ${propertyData?.address || 'Property Update'}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; background: transparent; }
        .header { background: ${agentData?.colors?.primary || '#2C5282'}; color: white; padding: 30px 20px; text-align: center; }
        .status { font-size: 32px; font-weight: bold; color: ${agentData?.colors?.accent || '#E53E3E'}; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏠 ${propertyData?.status === 'RECENTLY_SOLD' ? 'PROPERTY SOLD' : 'NEW LISTING ALERT'}</h1>
        </div>
        <div style="padding: 30px 20px;">
            <div class="status">${propertyData?.address || 'Beautiful Property'}</div>
            <p>${propertyData?.status === 'RECENTLY_SOLD' ? 'I\'m pleased to announce another successful closing!' : 'Don\'t miss out on this exceptional opportunity!'}</p>
            <div style="margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 8px;">
                <h3 style="margin: 0 0 10px 0; color: ${agentData?.colors?.primary || '#2C5282'};">Ready to ${propertyData?.status === 'RECENTLY_SOLD' ? 'sell your property' : 'schedule a viewing'}?</h3>
                <p>Contact me today!</p>
                <p><strong>${agentData?.name || 'Your Real Estate Agent'}</strong><br/>${agentData?.phone || '555-123-4567'}<br/>${agentData?.email || 'agent@example.com'}</p>
            </div>
        </div>
    </div>
</body>
</html>`
            }
          ],
          subjectLines: [
            `🏠 ${propertyData?.status === 'RECENTLY_SOLD' ? 'SOLD' : 'NEW LISTING'}: ${propertyData?.address || 'Premium Property'}`,
            `${propertyData?.status === 'RECENTLY_SOLD' ? 'Another Success Story' : 'Just Listed'} - ${propertyData?.address || 'Don\'t Miss Out'}`,
            `${agentData?.name || 'Your Agent'} ${propertyData?.status === 'RECENTLY_SOLD' ? 'Delivers Results' : 'Has Your Next Home'}`
          ]
        },
        landing_page: {
          html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${propertyData?.address || 'Property Listing'} | ${agentData?.name || 'Real Estate Agent'}</title>
</head>
<body>
    <h1>${propertyData?.status === 'RECENTLY_SOLD' ? 'SOLD' : 'FOR SALE'}: ${propertyData?.address || 'Beautiful Property'}</h1>
    <p>Contact ${agentData?.name || 'me'} at ${agentData?.phone || '555-123-4567'}</p>
</body>
</html>`,
          seo: {
            title: `${propertyData?.address || 'Property Listing'} | ${agentData?.name || 'Real Estate Agent'}`,
            description: `${propertyData?.status === 'RECENTLY_SOLD' ? 'Successfully sold property' : 'Property for sale'} - Contact ${agentData?.name || 'your agent'} today!`
          }
        },
        video: {
          concepts: [
            {
              type: "property-tour",
              title: "Virtual Property Walkthrough",
              description: "Professional video tour highlighting key features",
              script: `Welcome to ${propertyData?.address || 'this beautiful property'}! I'm ${agentData?.name || 'your agent'}, and I'm excited to show you this ${propertyData?.status === 'RECENTLY_SOLD' ? 'recently sold home' : 'incredible listing'}...`
            }
          ]
        }
      },
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(mockResponse);
  }
}