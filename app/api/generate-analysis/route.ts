import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import connect from '@/lib/db';
import User from '@/lib/models/User';
import BusinessPlan from '@/lib/models/Business';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { userId: clerkId } =await auth();
    if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

    await connect();
    const user = await User.findOne({ clerkId });
    if (!user) return new NextResponse("User not found", { status: 404 });

    const { businessPlanId } = await req.json();
    if (!businessPlanId) return new NextResponse("Business Plan ID is required", { status: 400 });

    const plan = await BusinessPlan.findOne({ _id: businessPlanId, userId: user._id });
    if (!plan) return new NextResponse("Business Plan not found or access denied", { status: 404 });

    const prompt = `
      You are FeasAI, an expert business analyst.
      Analyze the following business plan and provide your response as a single, valid JSON object.
      Do not include any text or markdown formatting outside of the JSON object.
      
      The JSON object must have the following exact structure:
      {
        "overallScore": <A number from 1 to 5, e.g., 3.5>,
        "keyMetrics": {
          "marketPotential": <A score from 0 to 100>,
          "financialViability": <A score from 0 to 100>,
          "innovationFactor": <A score from 0 to 100>
        },
        "reportMarkdown": "<A detailed feasibility report in Markdown. Use standard newlines.>"
      }
    `;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-latest",
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();

    // Safety net to remove the markdown wrapper if it exists
    if (responseText.startsWith("```json")) {
      responseText = responseText.substring(7, responseText.length - 3).trim();
    }
    
    // --- THIS IS THE CORRECT FIX FOR THE MARKDOWN \n ERROR ---
    // The previous `JSON.stringify` approach was wrong. This is the right way.
    // It manually escapes only the characters that would break JSON.parse,
    // preserving the newlines for ReactMarkdown to render correctly.
    const analysisObject = JSON.parse(responseText, (key, value) => {
      if (key === 'reportMarkdown' && typeof value === 'string') {
        return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      }
      return value;
    });

    // We now save the CORRECTLY PARSED object as a string.
    plan.aiResponse = JSON.stringify(analysisObject);
    await plan.save();

    return NextResponse.json(analysisObject);

  } catch (error) {
    console.error("[GENERATE_ANALYSIS_ERROR]", error);
    return new NextResponse(JSON.stringify({ error: "Failed to parse AI response." }), { status: 500 });
  }
}