// import { NextResponse } from 'next/server';
// import { auth } from '@clerk/nextjs/server';
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import connect from '@/lib/db';
// import User from '@/lib/models/User';
// import BusinessPlan from '@/lib/models/Business';

// if (!process.env.GEMINI_API_KEY) {
//   throw new Error("GEMINI_API_KEY is not defined in environment variables.");
// }

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// export async function POST(req: Request) {
//   try {
//     const { userId: clerkId } = await auth();
//     if (!clerkId) {
//       return NextResponse.json({ error: "Unauthorized: User not logged in." }, { status: 401 });
//     }

//     await connect();
//     const user = await User.findOne({ clerkId });
//     if (!user) {
//       return NextResponse.json({ error: "Authenticated user not found in the database." }, { status: 404 });
//     }

//     const { businessPlanId } = await req.json();
//     if (!businessPlanId) {
//       return NextResponse.json({ error: "Business Plan ID is required." }, { status: 400 });
//     }

//     const plan = await BusinessPlan.findOne({ _id: businessPlanId, userId: user._id });
//     if (!plan) {
//       return NextResponse.json({ error: "Business Plan not found or you do not have permission to access it." }, { status: 404 });
//     }

//     const businessDetails = `
//       --- BUSINESS PLAN DETAILS TO ANALYZE ---
//       Business Name: ${plan.businessName}
//       Industry: ${plan.businessIndustry}
//       Description: ${plan.businessDescription}
//       Target Audience: ${plan.businessAudience}
//       Short-Term Goals: ${plan.shortTermGoals}
//       Long-Term Goals: ${plan.longTermGoals}
//       Budget Info: ${plan.businessBudget}
//       --- END OF DETAILS ---
//     `;

//     // PROMPT 1: The professional, analytical report
//     const professionalPrompt = `
//       You are FeasAI, an expert business analyst. Analyze the following business plan details and provide your response strictly as a single, valid JSON object.
//       Do not include any text or markdown formatting outside of the JSON object.
//       The JSON object must have the exact structure:
//       {
//         "overallScore": <A number from 1 to 5>,
//         "keyMetrics": { "marketPotential": <0-100>, "financialViability": <0-100>, "innovationFactor": <0-100> },
//         "reportMarkdown": "<A detailed feasibility report in Markdown format.>"
//       }
//       ${businessDetails}
//       Now, generate the JSON response.
//     `;

//     // PROMPT 2: The brutal, insulting roast
//     const brutalPrompt = `
//       You are a cynical, ruthless, and brutally honest venture capitalist. Analyze the business plan details below and give a short, offensive, and insulting one-sentence verdict.
//       If the idea is good, give a reluctant compliment like "Fine, whatever, this might not bankrupt you immediately." or "Go all in, I guess. Don't screw it up."
//       If the idea is bad, be as insulting as possible, like "This is absolute dog shit, stop it immediately." or "Are you serious? This is the dumbest thing I've read all week."
//       Your entire response must be ONLY the single sentence verdict. Do not add any other text.
//       ${businessDetails}
//     `;

//     const professionalModel = genAI.getGenerativeModel({ 
//       model: "gemini-2.5-flash",
//       generationConfig: { responseMimeType: "application/json" }
//     });
    
//     const brutalModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

//     // Run both AI calls in parallel to save time
//     const [professionalResult, brutalResult] = await Promise.all([
//       professionalModel.generateContent(professionalPrompt),
//       brutalModel.generateContent(brutalPrompt)
//     ]);

//     const professionalResponseText = professionalResult.response.text();
//     const brutalVerdict = brutalResult.response.text();
    
//     const analysisObject = JSON.parse(professionalResponseText);

//     // Combine both results into a single object to send to the frontend
//     const finalResponse = {
//       ...analysisObject,
//       brutalVerdict: brutalVerdict,
//     };

//     // Save the combined response (including the roast) to the database
//     plan.aiResponse = JSON.stringify(finalResponse);
//     await plan.save();

//     return NextResponse.json(finalResponse);

//   } catch (error) {
//     console.error("[GENERATE_ANALYSIS_ERROR]", error);
//     const errorMessage = error instanceof Error ? error.message : "An unknown internal error occurred.";
//     return NextResponse.json({ error: errorMessage }, { status: 500 });
//   }
// }





import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import connect from '@/lib/db';
import User from '@/lib/models/User';
import BusinessPlan from '@/lib/models/Business';
/* eslint-disable @typescript-eslint/no-explicit-any */

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not defined in environment variables.');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- Utility to safely extract JSON from Gemini responses ---
function extractJson(text: string): any {
  try {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error('No JSON braces found');
    const jsonString = text
      .slice(start, end + 1)
      .replace(/(\r\n|\n|\r)/gm, '')
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']');
    return JSON.parse(jsonString);
  } catch (err) {
    console.error('⚠️ Failed to parse AI JSON:', err);
    return {
      overallScore: 0,
      keyMetrics: {
        marketPotential: 0,
        financialViability: 0,
        innovationFactor: 0,
      },
      reportMarkdown: 'Invalid JSON returned by AI.',
    };
  }
}

export async function POST(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized: User not logged in.' }, { status: 401 });
    }

    await connect();
    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json({ error: 'Authenticated user not found in the database.' }, { status: 404 });
    }

    const { businessPlanId } = await req.json();
    if (!businessPlanId) {
      return NextResponse.json({ error: 'Business Plan ID is required.' }, { status: 400 });
    }

    const plan = await BusinessPlan.findOne({ _id: businessPlanId, userId: user._id });
    if (!plan) {
      return NextResponse.json(
        { error: 'Business Plan not found or you do not have permission to access it.' },
        { status: 404 }
      );
    }

    const businessDetails = `
      --- BUSINESS PLAN DETAILS TO ANALYZE ---
      Business Name: ${plan.businessName}
      Industry: ${plan.businessIndustry}
      Description: ${plan.businessDescription}
      Target Audience: ${plan.businessAudience}
      Short-Term Goals: ${plan.shortTermGoals}
      Long-Term Goals: ${plan.longTermGoals}
      Budget Info: ${plan.businessBudget}
      --- END OF DETAILS ---
    `;

    // Professional prompt: JSON-based feasibility report
    const professionalPrompt = `
      You are FeasAI, an expert business analyst. Return ONLY valid JSON.
      Do NOT include any explanations, markdown, or code fences.

      Output must exactly match this format:
      {
        "overallScore": <number 1-5>,
        "keyMetrics": { "marketPotential": <0-100>, "financialViability": <0-100>, "innovationFactor": <0-100> },
        "reportMarkdown": "<markdown report>"
      }

      ${businessDetails}
      Now generate the JSON output only.
    `;

    // Brutal prompt: short roast response
    const brutalPrompt = `
      You are a cynical, ruthless, and brutally honest venture capitalist.
      Analyze the business plan details below and give a short, offensive, and insulting one-sentence verdict.
      If the idea is good, give a reluctant compliment like:
      "Fine, whatever, this might not bankrupt you immediately."
      or "Go all in, I guess. Don't screw it up."
      If the idea is bad, be as insulting as possible, like:
      "This is absolute dog shit, stop it immediately."
      or "Are you serious? This is the dumbest thing I've read all week."
      Respond ONLY with that one sentence, nothing else.
      ${businessDetails}
    `;

    const professionalModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const brutalModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Run both AI requests in parallel
    const [professionalResult, brutalResult] = await Promise.all([
      professionalModel.generateContent(professionalPrompt),
      brutalModel.generateContent(brutalPrompt),
    ]);

    // ✅ NEW API RESPONSE FORMAT
    const professionalResponseText = professionalResult.response.text();
    const brutalVerdict = brutalResult.response.text();

    const analysisObject = extractJson(professionalResponseText);

    const finalResponse = {
      ...analysisObject,
      brutalVerdict,
    };

    plan.aiResponse = JSON.stringify(finalResponse);
    await plan.save();

    return NextResponse.json(finalResponse);
  } catch (error) {
    console.error('[GENERATE_ANALYSIS_ERROR]', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown internal error occurred.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
