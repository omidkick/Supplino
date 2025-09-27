"use client";

import React from "react";
import Loader from "@/ui/Loader";
import Empty from "@/ui/Empty";
import { useAllComments } from "@/hooks/useComment";
import CommentsTable from "./_components/CommentsTable";

function CommentsPage() {
  const { comments, isLoadingComments } = useAllComments();
  // console.log(comments);

  if (isLoadingComments) return <Loader />;

   return (
      <div>
        {/* Title + Add Comment Btn*/}
        <div className="text-secondary-800 gap-y-6 mb-6 md:mb-12 mt-8 md:mt-2">
          <h1 className="font-extrabold text-xl md:text-2xl order-1">
          لیست نظرات
          </h1>
        </div>
  
        {/* CommentsTable */}
        {comments?.length > 0 ? (
          <CommentsTable comments={comments} />
        ) : (
          <Empty resourceName="نظری" />
        )}
      </div>
    );
}

export default CommentsPage;
