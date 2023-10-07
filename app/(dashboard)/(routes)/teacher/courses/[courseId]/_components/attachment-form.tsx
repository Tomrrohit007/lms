"use client";

import * as z from "zod";
import { Button } from "@/components/ui/button";
import { File, Loader2, PlusCircle, X } from "lucide-react";
import { useState } from "react";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@prisma/client";
import { FileUpload } from "@/components/file-upload";

type AttachmentFormProps = {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
};

const formSchema = z.object({
  url: z.string().min(1),
});

export const AttachmentForm = ({
  initialData,
  courseId,
}: AttachmentFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await fetch(`/api/courses/${courseId}/attachments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        toast.success("Course updated");
        toggleEdit();
        router.refresh();
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const res = await fetch(`/api/courses/${courseId}/attachments/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Attachment deleted");
        toggleEdit();
        router.refresh();
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
    }
    setDeletingId(null);
  };

  return (
    <div className='mt-6 border bg-slate-100 rounded-md p-4'>
      <div className='font-medium flex items-center justify-between'>
        Course attachments
        <Button variant='ghost' onClick={toggleEdit}>
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className='h-4 w-4 mr-2' />
              Add an file
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className='text-sm mt-2 text-slate-500 italic'>
              No attachments yet
            </p>
          )}
          {initialData.attachments.length > 0 && (
            <div className='space-y-2'>
              {initialData.attachments.map((attachment) => (
                <div
                  className='flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md'
                  key={attachment.id}
                >
                  <File className='h-4 w-4 mr-2 flex-shrink-0' />
                  <p className='text-xs line-clamp-1'>{attachment.name}</p>
                  {deletingId === attachment.id && (
                    <div>
                      <Loader2 className='h-4 w-4 animate-spin' />
                    </div>
                  )}
                  {deletingId !== attachment.id && (
                    <button
                      className='ml-auto hover:opacity-75 transition'
                      onClick={() => onDelete(attachment.id)}
                      type='button'
                    >
                      <X className='h-4 w-4' />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint='courseAttachment'
            onChange={(url) => {
              if (url) {
                onSubmit({ url });
              }
            }}
          />
          <div className='text-xs text-muted-foreground mt-4'>
            Add anything your students might need to complete the course.
          </div>
        </div>
      )}
    </div>
  );
};
