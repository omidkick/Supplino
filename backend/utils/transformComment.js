async function transformComment(comment, user) {
  // Initialize arrays if they don't exist
  if (!comment.likes) comment.likes = [];
  if (!comment.dislikes) comment.dislikes = [];
  if (!comment.answers) comment.answers = [];

  // Basic interaction counts and status
  comment.likesCount = comment.likes.length;
  comment.dislikesCount = comment.dislikes.length;
  comment.answersCount = comment.answers.length;
  comment.isLiked = false;
  comment.isDisliked = false;

  // Calculate date duration (similar to your calculateDateDuration function)
  comment.createdAtFormatted = formatDateDuration(comment.createdAt);

  // Handle user avatar URL
  if (comment.user?.avatar) {
    comment.user.avatarUrl = comment.user.avatar.startsWith("http")
      ? comment.user.avatar
      : `${process.env.SERVER_URL}/${comment.user.avatar}`;
  }

  // Transform answers recursively
  if (comment.answers && comment.answers.length > 0) {
    comment.answers = await Promise.all(
      comment.answers.map((answer) => transformComment(answer, user))
    );
  }

  // If no user is logged in
  if (!user) {
    comment.isLiked = false;
    comment.isDisliked = false;

    // Remove sensitive data
    delete comment.likes;
    delete comment.dislikes;

    return comment;
  }

  // Check if user has liked/disliked this comment
  comment.isLiked = comment.likes.some(
    (id) => id.toString() === user._id.toString()
  );
  comment.isDisliked = comment.dislikes.some(
    (id) => id.toString() === user._id.toString()
  );

  // Remove sensitive data arrays
  delete comment.likes;
  delete comment.dislikes;

  return comment;
}

// Helper function to format date duration (similar to your existing function)
function formatDateDuration(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) return `${seconds} ثانیه پیش`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} دقیقه پیش`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ساعت پیش`;
  const days = Math.floor(hours / 24);
  return `${days} روز پیش`;
}

module.exports = {
  transformComment,
  formatDateDuration,
};
