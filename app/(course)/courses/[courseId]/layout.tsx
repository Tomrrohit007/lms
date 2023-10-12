import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { CourseSidebar } from "./_component/course-sidebar";

type CourseIdLayoutProps = {
  children: ReactNode;
  params: { courseId: string };
};

const CourseLayout = async ({ children, params }: CourseIdLayoutProps) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId,
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });
  if (!course) {
    return redirect("/");
  }

  const progressCount = await getProgress(userId, course.id);

  return (
    <div className='h-full'>
        <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 x-z50">
            <CourseSidebar course={course} progressCount={progressCount} />
        </div>
      <main className="md:pl-80 h-full">{children}</main>
    </div>
  );
};

export default CourseLayout;
