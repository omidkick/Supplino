async function transformProduct(product, user) {
  // Initialize arrays if they don't exist
  if (!product.likes) product.likes = [];
  if (!product.bookmarks) product.bookmarks = [];
  if (!product.reviews) product.reviews = [];
  if (!product.thumbnails) product.thumbnails = [];

  // Basic interaction counts and status
  product.likesCount = product.likes.length;
  product.bookmarksCount = product.bookmarks.length;
  product.reviewsCount = product.reviews.length;
  product.isLiked = false;
  product.isBookmarked = false;

  // Product-specific computed fields
  product.hasDiscount = product.discount > 0;
  product.isInStock = product.countInStock > 0;
  product.finalPrice = product.hasDiscount ? product.offPrice : product.price;

  // Calculate average rating if reviews exist
  if (product.reviews && product.reviews.length > 0) {
    const totalRating = product.reviews.reduce(
      (sum, review) => sum + (review.rating || 0),
      0
    );
    product.averageRating = (totalRating / product.reviews.length).toFixed(1);
  } else {
    product.averageRating = 0;
  }

  // Handle cover image URL - ALWAYS return full URL
  if (product.coverImage) {
    if (
      product.coverImage.startsWith("http://") ||
      product.coverImage.startsWith("https://")
    ) {
      product.coverImageUrl = product.coverImage;
    } else {
      product.coverImageUrl = `${process.env.SERVER_URL}/${product.coverImage}`;
    }
  }

  // Handle legacy imageLink field
  if (product.imageLink && !product.coverImageUrl) {
    if (
      product.imageLink.startsWith("http://") ||
      product.imageLink.startsWith("https://")
    ) {
      product.coverImageUrl = product.imageLink;
    } else {
      product.coverImageUrl = `${process.env.SERVER_URL}/${product.imageLink}`;
    }
  }

  // ✅ NEW: Handle thumbnail images
  product.thumbnailUrls = [];
  if (product.thumbnails && product.thumbnails.length > 0) {
    product.thumbnailUrls = product.thumbnails
      .filter((thumb) => thumb.isActive)
      .sort((a, b) => a.order - b.order)
      .map((thumb) => ({
        url:
          thumb.path.startsWith("http://") || thumb.path.startsWith("https://")
            ? thumb.path
            : `${process.env.SERVER_URL}/${thumb.path}`,
        alt: thumb.alt || product.title,
        order: thumb.order,
      }));
  }

  // Handle creator/seller avatar
  if (product.creator?.avatar) {
    product.creator.avatarUrl = `${process.env.SERVER_URL}/${product.creator.avatar}`;
  }

  // Handle category icon if exists
  if (product.category?.icon) {
    product.category.iconUrl = `${process.env.SERVER_URL}/${product.category.icon}`;
  }

  // NEW: Handle category image if exists
  if (product.category?.image) {
    product.category.imageUrl = `${process.env.SERVER_URL}/${product.category.image}`;
  }

  // Handle related products
  if (product.related && product.related.length > 0) {
    product.related = product.related.map((item) => {
      return {
        ...item,
        coverImageUrl: item.coverImage
          ? `${process.env.SERVER_URL}/${item.coverImage}`
          : null,
        thumbnailUrls: item.thumbnails
          ? item.thumbnails
              .filter((thumb) => thumb.isActive)
              .sort((a, b) => a.order - b.order)
              .map((thumb) => ({
                url: `${process.env.SERVER_URL}/${thumb.path}`,
                alt: thumb.alt || item.title,
                order: thumb.order,
              }))
          : [],
        creator: item.creator
          ? {
              ...item.creator,
              avatarUrl: item.creator.avatar
                ? `${process.env.SERVER_URL}/${item.creator.avatar}`
                : null,
            }
          : null,
        finalPrice: item.discount > 0 ? item.offPrice : item.price,
        hasDiscount: item.discount > 0,
        isInStock: item.countInStock > 0,
      };
    });
  }

  // If no user is logged in
  if (!user) {
    product.isLiked = false;
    product.isBookmarked = false;

    // Remove sensitive data but keep thumbnails array structure
    delete product.likes;
    delete product.bookmarks;
    delete product.reviews;
    delete product.thumbnails; // Remove raw thumbnails, keep thumbnailUrls

    return product;
  }

  // Check if user has liked this product
  if (product.likes.some((id) => id.toString() === user._id.toString())) {
    product.isLiked = true;
  }

  // Check if user has bookmarked this product
  if (product.bookmarks.some((id) => id.toString() === user._id.toString())) {
    product.isBookmarked = true;
  }

  // Remove sensitive data arrays but keep processed URLs
  delete product.likes;
  delete product.bookmarks;
  delete product.reviews;
  delete product.thumbnails;

  return product;
}

module.exports = {
  transformProduct,
};
