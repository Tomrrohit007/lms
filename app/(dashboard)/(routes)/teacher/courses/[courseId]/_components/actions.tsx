"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface ActionProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
}

export const Actions = ({ disabled, courseId, isPublished }: ActionProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const confetti = useConfettiStore();

  const onDelete = async () => {
    try {
      setIsLoading(true);

      const res = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await res.json();
        toast.success("Course Delete");
        router.refresh();
        router.push(`/teacher/courses`);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        const res = await fetch(`/api/courses/${courseId}/unpublish `, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          await res.json();
          toast.success("Course unpublished");
        }
      } else {
        const res = await fetch(`/api/courses/${courseId}/publish `, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          await res.json();
          toast.success("Course published");
          confetti.onOpen();
        }
      }
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex items-center gap-x-2'>
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant='outline'
        size='sm'
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size='sm' disabled={isLoading}>
          <Trash className='h-4 w-4' />
        </Button>
      </ConfirmModal>
    </div>
  );
};
