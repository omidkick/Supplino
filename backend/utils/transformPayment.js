// utils/transformPayment.js
function transformPayment(payment, options = {}) {
  try {
    const paymentObj = payment.toObject ? payment.toObject() : { ...payment };
    
    // Add status text mapping for frontend convenience
    const statusMap = {
      1: "PROCESSING",
      2: "DELIVERED_TO_POST_OFFICE",
      3: "DELIVERED_TO_USER"
    };
    
    // Add status text for frontend
    if (paymentObj.orderStatus !== undefined) {
      paymentObj.orderStatusText = statusMap[paymentObj.orderStatus] || "UNKNOWN";
    }
    
    // Transform user avatar
    if (paymentObj.user && paymentObj.user.avatar) {
      const baseUrl = process.env.SERVER_URL || '';
      paymentObj.user.avatarUrl = `${baseUrl}/${paymentObj.user.avatar.replace(/^\/+/, '')}`;
      
      // Only remove original avatar if requested
      if (options.removeOriginalPaths !== false) {
        delete paymentObj.user.avatar;
      }
    }
    
    // Transform product images in productDetails array
    if (paymentObj.cart && paymentObj.cart.productDetails && Array.isArray(paymentObj.cart.productDetails)) {
      paymentObj.cart.productDetails = paymentObj.cart.productDetails.map(product => {
        if (product.coverImage) {
          const baseUrl = process.env.SERVER_URL || '';
          product.coverImageUrl = `${baseUrl}/${product.coverImage.replace(/^\/+/, '')}`;
          
          if (options.removeOriginalPaths !== false) {
            delete product.coverImage;
          }
        }
        return product;
      });
    }
    
    // Transform product images in products array (if it exists)
    if (paymentObj.cart && paymentObj.cart.products && Array.isArray(paymentObj.cart.products)) {
      paymentObj.cart.products = paymentObj.cart.products.map(product => {
        if (product.productId && product.productId.coverImage) {
          const baseUrl = process.env.SERVER_URL || '';
          product.productId.coverImageUrl = 
            `${baseUrl}/${product.productId.coverImage.replace(/^\/+/, '')}`;
          
          if (options.removeOriginalPaths !== false) {
            delete product.productId.coverImage;
          }
        }
        
        if (product.productId && product.productId.thumbnails) {
          const baseUrl = process.env.SERVER_URL || '';
          product.productId.thumbnailUrls = product.productId.thumbnails
            .filter(thumb => thumb.isActive)
            .sort((a, b) => a.order - b.order)
            .map(thumb => ({
              url: `${baseUrl}/${thumb.path.replace(/^\/+/, '')}`,
              alt: thumb.alt,
              order: thumb.order,
            }));
        }
        
        return product;
      });
    }
    
    return paymentObj;
  } catch (error) {
    console.error('Error transforming payment:', error);
    return payment.toObject ? payment.toObject() : payment;
  }
}

module.exports = { transformPayment };