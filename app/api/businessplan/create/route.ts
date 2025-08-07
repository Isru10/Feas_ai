import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server'; // Using Clerk's backend functions
import connect from '@/lib/db'; // Your existing DB connection helper
import User from '@/lib/models/User';
import BusinessPlan from '@/lib/models/Business';

export async function POST(req: Request) {
  try {
    // 1. Authenticate the user with Clerk
    const { userId: clerkId } =await auth();
    console.log(req.headers);
    if (!clerkId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connect();

    // 2. Find the user in your database using their Clerk ID
    const user = await User.findOne({ clerkId });
    if (!user) {
      // This is a safety check. In your flow, the user should always exist.
      return new NextResponse("User not found in database. Please log in again.", { status: 404 });
    }

    // 3. Create a new, blank BusinessPlan linked to your user's MongoDB _id
    const newBusinessPlan = new BusinessPlan({
      userId: user._id,
      // All other fields are optional and will be empty by default
    });

    await newBusinessPlan.save();

    // 4. Return the ID of the new document
    return NextResponse.json({ businessPlanId: newBusinessPlan._id.toString() });

  } catch (error) {
    console.error("[CREATE_BUSINESS_PLAN_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}