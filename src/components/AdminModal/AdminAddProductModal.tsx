import React, { useState } from "react";
import styles from "./AdminAddProductModal.module.scss";
import { toast } from "react-toastify";
import { adminService } from "../../api/services/admin.service";
import type { Category } from "../../types/category";

interface AdminAddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
    onProductAdded?: () => void;
    onCreateCategory?: (name: string, charGroups: any[]) => Promise<void>;
}

// Шаблоны без значений
const TEMPLATES: Record<string, any> = {
    Смартфоны: {
        name: "Название телефона",
        img: "",
        characteristics_groups: [
            {
                name: "Размеры",
                characteristics: [
                    { name: "Ширина", value: "" },
                    { name: "Высота", value: "" },
                    { name: "Толщина", value: "" },
                    { name: "Вес", value: "" },
                ],
            },
            {
                name: "Корпус",
                characteristics: [
                    { name: "Материал задней панели", value: "" },
                    { name: "Материал граней", value: "" },
                    { name: "Пыле-влагозащита", value: "" },
                ],
            },
            {
                name: "Дисплей",
                characteristics: [
                    { name: "Тип экрана", value: "" },
                    { name: "Диагональ экрана", value: "" },
                    { name: "Разрешение экрана", value: "" },
                    { name: "Частота экрана", value: "" },
                    { name: "Яркость экрана", value: "" },
                    { name: "Плотность пикселей", value: "" },
                    { name: "Соотношение сторон", value: "" },
                ],
            },
            {
                name: "Процессор",
                characteristics: [
                    { name: "Модель процессора", value: "" },
                    { name: "Количество ядер", value: "" },
                ],
            },
            {
                name: "Батарея",
                characteristics: [{ name: "Аккумулятор", value: "" }],
            },
            {
                name: "Основная камера",
                characteristics: [
                    { name: "Количество камер", value: "" },
                    { name: "Количество мегапикселей", value: "" },
                ],
            },
            {
                name: "Фронтальная камера",
                characteristics: [{ name: "Фронтальная камера", value: "" }],
            },
            {
                name: "Операционная система",
                characteristics: [{ name: "Операционная система", value: "" }],
            },
            {
                name: "Bluetooth",
                characteristics: [{ name: "Bluetooth", value: "" }],
            },
        ],
    },
    Ноутбуки: {
        name: "Название ноутбука",
        img: "",
        characteristics_groups: [
            {
                name: "Размеры",
                characteristics: [
                    { name: "Ширина", value: "" },
                    { name: "Высота", value: "" },
                    { name: "Толщина", value: "" },
                    { name: "Вес", value: "" },
                ],
            },
            {
                name: "Дисплей",
                characteristics: [
                    { name: "Тип матрицы", value: "" },
                    { name: "Диагональ", value: "" },
                    { name: "Разрешение", value: "" },
                    { name: "Частота обновления", value: "" },
                ],
            },
            {
                name: "Процессор",
                characteristics: [
                    { name: "Модель", value: "" },
                    { name: "Количество ядер", value: "" },
                    { name: "Тактовая частота", value: "" },
                ],
            },
            {
                name: "Оперативная память",
                characteristics: [
                    { name: "Объем", value: "" },
                    { name: "Тип", value: "" },
                ],
            },
            {
                name: "Накопитель",
                characteristics: [
                    { name: "Тип", value: "" },
                    { name: "Объем", value: "" },
                ],
            },
            {
                name: "Видеокарта",
                characteristics: [
                    { name: "Модель", value: "" },
                    { name: "Объем памяти", value: "" },
                ],
            },
            {
                name: "Батарея",
                characteristics: [
                    { name: "Емкость", value: "" },
                    { name: "Время работы", value: "" },
                ],
            },
        ],
    },
    Планшеты: {
        name: "Название планшета",
        img: "",
        characteristics_groups: [
            {
                name: "Размеры",
                characteristics: [
                    { name: "Ширина", value: "" },
                    { name: "Высота", value: "" },
                    { name: "Толщина", value: "" },
                    { name: "Вес", value: "" },
                ],
            },
            {
                name: "Дисплей",
                characteristics: [
                    { name: "Тип экрана", value: "" },
                    { name: "Диагональ", value: "" },
                    { name: "Разрешение", value: "" },
                    { name: "Частота обновления", value: "" },
                ],
            },
            {
                name: "Процессор",
                characteristics: [
                    { name: "Модель", value: "" },
                    { name: "Количество ядер", value: "" },
                ],
            },
            {
                name: "Батарея",
                characteristics: [{ name: "Аккумулятор", value: "" }],
            },
            {
                name: "Камера",
                characteristics: [
                    { name: "Основная", value: "" },
                    { name: "Фронтальная", value: "" },
                ],
            },
        ],
    },
    Консоли: {
        name: "Название консоли",
        img: "",
        characteristics_groups: [
            {
                name: "Размеры",
                characteristics: [
                    { name: "Ширина", value: "" },
                    { name: "Высота", value: "" },
                    { name: "Толщина", value: "" },
                    { name: "Вес", value: "" },
                ],
            },
            {
                name: "Процессор",
                characteristics: [
                    { name: "Модель", value: "" },
                    { name: "Тактовая частота", value: "" },
                ],
            },
            {
                name: "Графика",
                characteristics: [
                    { name: "Модель", value: "" },
                    { name: "Производительность", value: "" },
                ],
            },
            {
                name: "Память",
                characteristics: [
                    { name: "Оперативная память", value: "" },
                    { name: "Встроенный накопитель", value: "" },
                ],
            },
        ],
    },
};

export default function AdminAddProductModal({
    isOpen,
    onClose,
    categories,
    onProductAdded,
    onCreateCategory,
}: AdminAddProductModalProps) {
    const [categoryInput, setCategoryInput] = useState("");
    const [jsonInput, setJsonInput] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [charGroupsJson, setCharGroupsJson] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    // При выборе категории вставляем шаблон в текстовое поле
    const handleCategoryChange = (categoryName: string) => {
        setCategoryInput(categoryName);

        // Получаем шаблон для выбранной категории
        const template = TEMPLATES[categoryName];
        if (template) {
            const cleanTemplate = JSON.parse(JSON.stringify(template));

            // Удаляем id если они есть
            if (cleanTemplate.characteristics_groups) {
                cleanTemplate.characteristics_groups =
                    cleanTemplate.characteristics_groups.map((group: any) => ({
                        ...group,
                        characteristics: group.characteristics.map(
                            (char: any) => {
                                const { id, ...rest } = char;
                                return rest;
                            },
                        ),
                    }));
            }

            const templateString = JSON.stringify(cleanTemplate, null, 2);
            setJsonInput(templateString);
        }
    };

    const handleAddProduct = async () => {
        let productData;
        try {
            productData = JSON.parse(jsonInput);
        } catch (error) {
            toast.error("Ошибка: Невалидный JSON!");
            return;
        }

        if (!productData.name || productData.name.trim() === "") {
            toast.warning("В JSON должен быть указан 'name' товара!");
            return;
        }

        if (!categoryInput && !isCreatingCategory) {
            toast.warning("Выберите категорию!");
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                name: productData.name,
                category: categoryInput,
                ...(imageUrl && { img: imageUrl }),
                ...(productData.characteristics_groups && {
                    characteristics_groups: productData.characteristics_groups,
                }),
            };

            await adminService.quickAddProduct(payload);
            toast.success("Товар успешно добавлен!");

            setJsonInput("");
            setImageUrl("");
            setCategoryInput("");

            onProductAdded?.();
            onClose();
        } catch (err: any) {
            toast.error(err.message || "Ошибка при добавлении товара");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) {
            toast.warning("Введите название категории!");
            return;
        }

        let charGroups = [];
        if (charGroupsJson.trim()) {
            try {
                charGroups = JSON.parse(charGroupsJson);
                if (!Array.isArray(charGroups)) {
                    throw new Error("char_groups должен быть массивом");
                }
            } catch (error) {
                toast.error(
                    "Ошибка: Невалидный JSON в структуре характеристик!",
                );
                return;
            }
        }

        setIsLoading(true);
        try {
            if (onCreateCategory) {
                await onCreateCategory(newCategoryName, charGroups);
            } else {
                await adminService.createCategory({
                    name: newCategoryName,
                    char_groups: charGroups,
                });
            }
            toast.success("Категория успешно создана!");
            setNewCategoryName("");
            setCharGroupsJson("");
            setIsCreatingCategory(false);
            onProductAdded?.();
        } catch (err: any) {
            toast.error(err.message || "Ошибка при создании категории");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h3 className={styles.modalTitle}>
                    {isCreatingCategory
                        ? "Создание категории"
                        : "Добавление товара"}
                </h3>

                {!isCreatingCategory ? (
                    <>
                        {/* Выбор категории */}
                        <div className={styles.categoryBlock}>
                            <select
                                value={categoryInput}
                                onChange={(e) =>
                                    handleCategoryChange(e.target.value)
                                }
                                className={styles.select}
                            >
                                <option value="" disabled>
                                    Выберите категорию
                                </option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.name}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            <button
                                className={styles.toggleCategoryBtn}
                                onClick={() => setIsCreatingCategory(true)}
                            >
                                + Создать новую категорию
                            </button>
                        </div>

                        {/* Текстовое поле для JSON */}
                        <textarea
                            placeholder="Здесь появится шаблон для копирования. Скопируйте его (Ctrl+C) и отправьте ИИ для заполнения."
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                            className={styles.textarea}
                            rows={12}
                        />

                        {/* URL картинки */}
                        <input
                            type="text"
                            placeholder="Введите URL на картинку"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className={styles.input}
                        />

                        {/* Предпросмотр */}
                        {imageUrl && (
                            <div className={styles.previewBlock}>
                                <p>Предпросмотр</p>
                                <img
                                    src={imageUrl}
                                    alt="Preview"
                                    onError={(e) => {
                                        (
                                            e.target as HTMLImageElement
                                        ).style.display = "none";
                                        toast.error(
                                            "Не удалось загрузить изображение",
                                        );
                                    }}
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <input
                            type="text"
                            placeholder="Название новой категории"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            className={styles.input}
                        />

                        <textarea
                            placeholder={`Пример структуры характеристик:
[
  {
    "name": "Экран",
    "order": 1,
    "templates": [
      {"name": "Диагональ", "order": 1},
      {"name": "Разрешение", "order": 2}
    ]
  }
]`}
                            value={charGroupsJson}
                            onChange={(e) => setCharGroupsJson(e.target.value)}
                            className={styles.textarea}
                            rows={12}
                        />

                        <button
                            className={styles.toggleCategoryBtn}
                            onClick={() => setIsCreatingCategory(false)}
                        >
                            ← Вернуться к добавлению товара
                        </button>
                    </>
                )}

                <div className={styles.actionButtons}>
                    <button
                        className={styles.submitBtn}
                        onClick={
                            isCreatingCategory
                                ? handleCreateCategory
                                : handleAddProduct
                        }
                        disabled={isLoading}
                    >
                        {isLoading
                            ? "Загрузка..."
                            : isCreatingCategory
                              ? "Создать категорию"
                              : "Добавить товар"}
                    </button>
                    <button className={styles.cancelBtn} onClick={onClose}>
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );
}
