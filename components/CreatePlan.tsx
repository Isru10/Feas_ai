"use client";
import { useDispatch } from 'react-redux';
import { setPlanId } from '@/redux/planSlice';
import { useRouter } from 'next/navigation';

const CreatePlanButton = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleCreatePlan = async () => {
    const res = await fetch("/api/plans", {
      method: "POST",
      body: JSON.stringify({ name: "My First Plan" }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    dispatch(setPlanId(data._id)); // 🔥 Save the planId in redux
    router.push("/businessname");   // navigate to first page
  };

  return <button onClick={handleCreatePlan}>Create Plan</button>;
};

export default CreatePlanButton;
