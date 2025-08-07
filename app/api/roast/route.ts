import { NextResponse } from "next/server";
import { generateBusinessPlan } from "@/lib/gemini";
/* eslint-disable @typescript-eslint/no-explicit-any */

export async function POST(req: Request) {
  try {
    const { businessData } = await req.json();
    if (!businessData) {
      return NextResponse.json({ error: "Business data is required" }, { status: 400 });
    }

//     const prompt = `
// You are a startup consultant AI. A user has entered the following business information:

// Business Name: ${businessData.businessName}
// Industry: ${businessData.industry}
// Location: ${businessData.location}
// Target Audience: ${businessData.targetAudience}
// Description: ${businessData.description}
// Initial Capital: ${businessData.capital}
// Goal: ${businessData.goal}

// Analyze this and return:
// 1. A roast (fun, light-hearted critique)
// 2. A detailed plan suggestion
// 3. Tips or recommendations

// Be witty but helpful.
// `; 
        const prompt = `hello, what is your name`

    const aiResponse = await generateBusinessPlan(prompt);

    return NextResponse.json({ result: aiResponse });
  } catch (error:any) {
    return NextResponse.json({ error: "Failed to generate plan.", message: error.message }, { status: 500 });
  }
}
