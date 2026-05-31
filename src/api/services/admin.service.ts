import { apiClient } from "../apiClient";
import type { Category } from "../../types/category";

export type CharTemplate = {
    name: string;
    order: number;
};

export type CharGroupTemplate = {
    name: string;
    order: number;
    templates: CharTemplate[];
};

export type CreateCategoryRequest = {
    name: string;
    char_groups: CharGroupTemplate[];
};

// Формат для быстрого добавления товара согласно API
export type QuickAddProductRequest = {
    name: string;
    category: string;
    img?: string;
    characteristics_groups?: Array<{
        name: string;
        characteristics: Array<{
            name: string;
            value: string;
        }>;
    }>;
};

export const adminService = {
    // Создание категории с каркасом характеристик
    createCategory: (data: CreateCategoryRequest) =>
        apiClient.post<Category>("/catalog/admin/categories/", data),

    // Удаление категории
    deleteCategory: (id: number) =>
        apiClient.delete(`/catalog/admin/categories/${id}/`),

    // Удаление товара
    deleteProduct: (id: number) =>
        apiClient.delete(`/catalog/admin/products/${id}/`),

    // Быстрое добавление товара через JSON
    quickAddProduct: (data: QuickAddProductRequest) =>
        apiClient.post<{ detail: string; product_id: number }>(
            "/catalog/createProduct/",
            data,
        ),
};
