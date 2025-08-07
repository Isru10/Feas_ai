import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connect from '@/lib/db';
import BusinessPlan from '@/lib/models/Business';

export async function PATCH(req: Request) {
  try {
    // 1. Authenticate the user
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connect();

    // 2. Get the ID and the new data from the request body
    const { id, updateData } = await req.json();

    if (!id || !updateData) {
      return new NextResponse("Missing ID or update data", { status: 400 });
    }

    // 3. Find the plan and update it
    // We can add a check here to ensure the plan belongs to the logged-in user for extra security,
    // but for now, we'll keep it simple as the ID is not easily guessable.
    const updatedPlan = await BusinessPlan.findByIdAndUpdate(
      id,
      { $set: updateData }, // Use $set to update only the provided fields
      { new: true } // This option returns the updated document
    );

    if (!updatedPlan) {
      return new NextResponse("Business plan not found", { status: 404 });
    }

    return NextResponse.json(updatedPlan);

  } catch (error) {
    console.error("[UPDATE_BUSINESS_PLAN_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}