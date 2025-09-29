
import http from "./httpService";

export async function getAllProducts(qs = "", cookies = "") {
  try {
    const response = await http.get(`/product/list?${qs}`);
    // Remove the headers with Cookie since withCredentials handles it automatically
    
    // Add safe data extraction with defaults
    return {
      products: response?.data?.data?.products || [],
      totalPages: response?.data?.data?.totalPages || 1,
      currentPage: response?.data?.data?.currentPage || 1,
      itemsPerPage: response?.data?.data?.itemsPerPage || 10,
      totalCount: response?.data?.data?.totalCount || 0,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    // Return safe fallback
    return {
      products: [],
      totalPages: 1,
      currentPage: 1,
      itemsPerPage: 10,
      totalCount: 0,
    };
  }
}

export async function getOneProductBySlug(slug) {
  try {
    const response = await http.get(`/product/slug/${slug}`);
    return response?.data?.data || {};
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return {};
  }
}

export async function getOneProductById(id) {
  try {
    const response = await http.get(`/product/${id}`);
    return {
      product: response?.data?.data?.product || {},
      ...response?.data?.data
    };
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return { product: {} };
  }
}


// ... keep other functions the same but add try-catch
export async function likeProduct(id) {
  try {
    const response = await http.post(`/product/like/${id}`);
    return response?.data?.data || {};
  } catch (error) {
    console.error("Error liking product:", error);
    throw error; // Re-throw for UI to handle
  }
}

export async function toggleBookmark(id) {
  try {
    const response = await http.post(`/product/bookmark/${id}`);
    return response?.data?.data || {};
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    throw error;
  }
}

// Admin functions with error handling
export async function addProduct(data) {
  try {
    const response = await http.post(`/admin/product/add`, data);
    return response?.data?.data || {};
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
}

export async function removeProduct(id) {
  try {
    const response = await http.delete(`/admin/product/remove/${id}`);
    return response?.data?.data || {};
  } catch (error) {
    console.error("Error removing product:", error);
    throw error;
  }
}

export async function updateProduct({ id, data }) {
  try {
    const response = await http.patch(`/admin/product/update/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response?.data?.data || {};
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}