import http from "./httpService";

export async function getAllCategories(qs = "", cookies = "") {
  try {
    const response = await http.get(`/category/list?${qs}`);

    return {
      categories: response?.data?.data?.categories || [],
      ...response?.data?.data,
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { categories: [] };
  }
}

export async function getCategoryById(id) {
  try {
    const response = await http.get(`/category/${id}`);
    return response?.data?.data || {};
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    return {};
  }
}

export async function addNewCategory(data) {
  try {
    const response = await http.post("/admin/category/add", data);
    return response?.data?.data || {};
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
}

export async function updateCategory({ id, data }) {
  try {
    const response = await http.patch(`/admin/category/update/${id}`, data);
    return response?.data?.data || {};
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
}

export async function removeCategory(id) {
  try {
    const response = await http.delete(`/admin/category/remove/${id}`);
    return response?.data?.data || {};
  } catch (error) {
    console.error("Error removing category:", error);
    throw error;
  }
}
