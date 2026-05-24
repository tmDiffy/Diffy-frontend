import React, { useState } from "react";
import styles from "./AdminModal.module.scss"; // Создай стили по аналогии с твоим дизайном
import { toast } from "react-toastify";

interface AdminAddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: string[]; // Передаем существующие категории
}

export default function AdminAddProductModal({
    isOpen,
    onClose,
    categories,
}: AdminAddProductModalProps) {
    const [categoryInput, setCategoryInput] = useState("");
    const [jsonInput, setJsonInput] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);

    if (!isOpen) return null;

    const handleAddProduct = async () => {
        // 1. Валидация JSON (критически важно!)
        let parsedProductData;
        try {
            parsedProductData = JSON.parse(jsonInput);
        } catch (error) {
            toast.error("Ошибка парсинга: Невалидный JSON!");
            return;
        }

        // 2. Проверка заполненности
        if (!categoryInput) {
            toast.warning("Укажите категорию!");
            return;
        }

        const payload = {
            category: categoryInput,
            image: imageUrl,
            ...parsedProductData,
        };

        try {
            // Здесь твой API вызов
            // await productService.addProduct(payload);
            console.log("Данные на отправку:", payload);
            toast.success("Товар успешно добавлен!");
            onClose();
        } catch (err) {
            toast.error("Ошибка при добавлении товара");
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                {/* Выбор или создание категории */}
                <div className={styles.categoryBlock}>
                    {isCreatingCategory ? (
                        <input
                            type="text"
                            placeholder="Название новой категории"
                            value={categoryInput}
                            onChange={(e) => setCategoryInput(e.target.value)}
                            className={styles.input}
                        />
                    ) : (
                        <select
                            value={categoryInput}
                            onChange={(e) => setCategoryInput(e.target.value)}
                            className={styles.select}
                        >
                            <option value="" disabled>
                                Выберите категорию
                            </option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    )}
                    <button
                        className={styles.toggleCategoryBtn}
                        onClick={() =>
                            setIsCreatingCategory(!isCreatingCategory)
                        }
                    >
                        {isCreatingCategory
                            ? "Выбрать из списка"
                            : "Добавить новую"}
                    </button>
                </div>

                {/* Поле для JSON */}
                <textarea
                    placeholder='{ "model": "Samsung Galaxy...", "specifications": {...} }'
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className={styles.textarea}
                    rows={10}
                />

                {/* URL картинки */}
                <input
                    type="text"
                    placeholder="Введи url на картинку"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className={styles.input}
                />
                <div className={styles.bottomSection}>
                    {/* Предпросмотр */}
                    {imageUrl && (
                        <div className={styles.previewBlock}>
                            <p>Предпросмотр</p>
                            <img
                                src={imageUrl}
                                alt="Preview"
                                onError={(e) =>
                                    (e.currentTarget.style.display = "none")
                                }
                            />
                        </div>
                    )}

                    {/* Кнопки управления */}
                    <div className={styles.actionButtons}>
                        <button
                            className={styles.submitBtn}
                            onClick={handleAddProduct}
                        >
                            Добавить
                        </button>
                        <button className={styles.cancelBtn} onClick={onClose}>
                            Отмена
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
