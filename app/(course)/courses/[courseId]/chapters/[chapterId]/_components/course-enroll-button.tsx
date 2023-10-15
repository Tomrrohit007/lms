"use client";

import { Button } from "@/components/ui/button";
import { formatprice } from "@/lib/format";
import { useState } from "react";
import toast from "react-hot-toast";

type CourseEnrollButtonProps = {
  price: number;
  courseId: string;
};

const CourseEnrollButton = ({ price, courseId }: CourseEnrollButtonProps) => {
  const [isLoading, setIstLoading] = useState(false);

  const onClick = async () => {
    try {
      setIstLoading(true);

      const res = await fetch(`/api/courses/${courseId}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        window.location.assign(data.url);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIstLoading(false);
    }
  };

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      size='sm'
      className='w-full md:w-auto'
    >
      Enroll for {formatprice(price)}
    </Button>
  );
};

export default CourseEnrollButton;
