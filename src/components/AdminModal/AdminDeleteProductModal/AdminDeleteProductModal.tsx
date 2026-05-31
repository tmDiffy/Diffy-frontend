import React, { useState } from "react";
import styles from "./AdminDeleteModal.module.scss";
import { toast } from "react-toastify";
import { adminService } from "../../../api/services/admin.service";
import { productService } from "../../../api/services/product.service";
import type { Product } from "../../../types/product";

interface AdminDeleteProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProductDeleted?: () => void;
}

export default function AdminDeleteProductModal({
    isOpen,
    onClose,
    onProductDeleted,
}: AdminDeleteProductModalProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(
        null,
    );
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [imageError, setImageError] = useState(false); // Добавляем состояние для ошибки изображения

    if (!isOpen) return null;

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            toast.warning("Введите название товара для поиска");
            return;
        }

        setIsLoading(true);
        try {
            const response = await productService.searchProduct(
                searchTerm,
                null,
            );
            setProducts(response.results || []);
            setSelectedProduct(null);
            setImageError(false); // Сбрасываем ошибку при новом поиске
            if (response.results?.length === 0) {
                toast.info("Товары не найдены");
            }
        } catch (err: any) {
            toast.error("Ошибка при поиске товаров");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectProduct = (product: Product) => {
        setSelectedProduct(product);
        setImageError(false); // Сбрасываем ошибку при выборе нового товара
    };

    const handleDelete = async () => {
        if (!selectedProduct) {
            toast.warning("Выберите товар для удаления");
            return;
        }

        setIsDeleting(true);
        try {
            await adminService.deleteProduct(selectedProduct.id);
            toast.success(`Товар "${selectedProduct.name}" успешно удален!`);

            setSelectedProduct(null);
            setImageError(false);

            if (searchTerm.trim()) {
                const response = await productService.searchProduct(
                    searchTerm,
                    null,
                );
                setProducts(response.results || []);
            } else {
                setProducts([]);
            }

            onProductDeleted?.();
            onClose();
        } catch (err: any) {
            toast.error(err.message || "Ошибка при удалении товара");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h3 className={styles.modalTitle}>Удаление товара</h3>

                {/* Поиск товара */}
                <div className={styles.searchBlock}>
                    <input
                        type="text"
                        placeholder="Введите название товара..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.input}
                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <button
                        className={styles.searchBtn}
                        onClick={handleSearch}
                        disabled={isLoading}
                    >
                        {isLoading ? "Поиск..." : "Найти"}
                    </button>
                </div>

                {/* Список найденных товаров */}
                {products.length > 0 && (
                    <>
                        <div className={styles.productsLabel}>
                            Найденные товары:
                        </div>
                        <div className={styles.productsList}>
                            {products.map((product) => (
                                <button
                                    key={product.id}
                                    className={`${styles.productItem} ${selectedProduct?.id === product.id ? styles.productItemSelected : ""}`}
                                    onClick={() => handleSelectProduct(product)}
                                >
                                    {product.name}
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {/* Предпросмотр выбранного товара */}
                {selectedProduct && (
                    <>
                        <div className={styles.previewLabel}>Предпросмотр</div>
                        <div className={styles.previewBlock}>
                            {selectedProduct.img && !imageError ? (
                                <img
                                    key={selectedProduct.id}
                                    src={selectedProduct.img}
                                    alt={selectedProduct.name}
                                    onError={() => setImageError(true)}
                                    style={{
                                        maxHeight: "120px",
                                        maxWidth: "100%",
                                        objectFit: "contain",
                                    }}
                                />
                            ) : (
                                <p style={{ color: "#999", margin: 0 }}>
                                    {imageError
                                        ? "Изображение не загрузилось"
                                        : "Нет изображения"}
                                </p>
                            )}
                        </div>
                    </>
                )}

                {/* Кнопки действий */}
                <div className={styles.actionButtons}>
                    <button
                        className={styles.deleteBtn}
                        onClick={handleDelete}
                        disabled={!selectedProduct || isDeleting}
                    >
                        {isDeleting ? "Удаление..." : "Удалить товар"}
                    </button>
                    <button className={styles.cancelBtn} onClick={onClose}>
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );
}
