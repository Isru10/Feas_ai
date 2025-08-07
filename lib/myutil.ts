
/* eslint-disable @typescript-eslint/no-explicit-any */

  export const handleRoastPlan = async ({ yourCollectedFormData }: any) => {
  const res = await fetch("/api/roast", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ businessData: yourCollectedFormData }),
  });

  const data = await res.json();
  console.log(data.result); // You can show it in a modal, toast, or textarea
};

