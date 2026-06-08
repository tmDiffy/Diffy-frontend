import styles from "./HomePage.module.scss";
import Search from "../../features/Compare/Search/Search";
import { useEffect, useRef, useState } from "react";
import ShortCompareCard from "../../features/Compare/ShortCompareCard/ShortCompareCard";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { type Product } from "../../types/product";
import { productService } from "../../api/services/product.service";
import { toast } from "react-toastify";
import AiModal from "../../components/AiModal/AiModal";
import AdminAddProductModal from "../../components/AdminModal/AdminAddProductModal/AdminAddProductModal";
import { adminService } from "../../api/services/admin.service";
import AdminDeleteProductModal from "../../components/AdminModal/AdminDeleteProductModal/AdminDeleteProductModal";

import favOff from "../../assets/icons/FavOff.svg";
import favOn from "../../assets/icons/FavOn.svg";
import Plus from "../../assets/icons/Plus.svg";
import CategoriesList from "../../features/Categories/CategoriesList";
import type { Category } from "../../types/category";
import { useAuth } from "../../context/AuthContext";
import { useCompare } from "../../context/CompareContext";

export function HomePage() {
    const { t, i18n } = useTranslation();

    const {
        products,
        setProducts,
        compareData,
        setCompareData,
        activeCategory,
        setActiveCategory,
        compareTrigger,
        setCompareTrigger,
    } = useCompare();

    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [categoriesList, setCategoriesList] = useState<Category[]>([]);

    const [isFav, setIsFav] = useState(false);

    const { user } = useAuth();
    const navigate = useNavigate();

    // 1. Загрузка категорий с привязкой к языку
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const categories = await productService.getAllCategories();
                setCategoriesList(categories);
            } catch (error) {
                console.error("Failed to load categories:", error);
            }
        };
        loadCategories();
    }, [i18n.language]);

    const handleCreateCategory = async (name: string, charGroups: any[]) => {
        try {
            await adminService.createCategory({
                name,
                char_groups: charGroups,
            });
            toast.success("Категория успешно создана!");
            const updatedCategories = await productService.getAllCategories();
            setCategoriesList(updatedCategories);
        } catch (err: any) {
            toast.error(err.message || "Ошибка при создании категории");
            throw err;
        }
    };

    const handleProductAdded = async () => {
        console.log("Товар добавлен, можно обновить список");
    };

    const updateProduct = (index: number, id: number, name: string) => {
        const updated = [...products];
        updated[index] = { id, name };
        setProducts(updated);
    };

    const selectedProducts = products.filter((p) => p.id !== 0);

    // Кнопка теперь инкрементирует счетчик, заставляя useEffect сработать
    const handleCompare = () => {
        const selectedIds = products.filter((p) => p.id !== 0).map((p) => p.id);
        if (selectedIds.length === 0) {
            toast.warning(t("home.errorSelect"));
            return;
        }
        setCompareTrigger((prev) => prev + 1);
    };

    // 2. Эффект для запроса сравнения (срабатывает при клике ИЛИ при смене языка)
    useEffect(() => {
        const selectedIds = products.filter((p) => p.id !== 0).map((p) => p.id);

        // Если еще ни разу не нажимали кнопку сравнения — ничего не делаем
        if (selectedIds.length === 0 || compareTrigger === 0) return;

        const fetchCompareData = async () => {
            const toastId = toast.loading(
                t("home.loading") || "Загрузка сравнения...",
            );
            try {
                const data = await productService.compare(selectedIds);
                setCompareData(data);
                setIsFav(false);
                toast.dismiss(toastId);
            } catch (err: any) {
                toast.update(toastId, {
                    render: t("home.errorLoad"),
                    type: "error",
                    isLoading: false,
                    autoClose: 3000,
                });
            }
        };

        fetchCompareData();
    }, [i18n.language, compareTrigger]); // Реагирует и на смену языка, и на изменение счетчика кликов

    const compareRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (compareData && compareData.length > 0) {
            compareRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }, [compareData]);

    const handleSaveToFavorites = async () => {
        if (!compareData) return;
        if (!user) {
            toast.warning(
                t("auth.loginRequired") ||
                    "Войдите в аккаунт, чтобы добавить в избранное",
            );

            navigate("/login", { state: { from: "/" } });
            return;
        }
        try {
            const ids = compareData.map((p: any) => p.id);
            await productService.saveToFavorites(ids);
            setIsFav(true);
            toast.success(t("home.alertSaved"));
        } catch (err: any) {
            toast.error(t("home.alertSaveError"));
        }
    };

    const handleCategorySelect = (category: Category | null) => {
        setActiveCategory(category);
        updateProduct(0, 0, "");
        console.log("Selected category:", category);
    };

    return (
        <main className={styles.home}>
            <div className={styles.searchBlock}>
                <div className={styles.categoriesHeader}>
                    <CategoriesList onSelect={handleCategorySelect} />
                </div>
                <div className={styles.searchContainer}>
                    <div className={styles.searchInputs}>
                        <Search
                            placeholder={t("home.searchPlaceholder1")}
                            value={products[0].name}
                            category={activeCategory}
                            onChange={(id, name) => updateProduct(0, id, name)}
                        />

                        {products[0].id !== 0 && (
                            <>
                                <div className={styles.plusIcon}>
                                    <img src={Plus} alt="plus" width="50" />
                                </div>
                                <Search
                                    placeholder={t("home.searchPlaceholder2")}
                                    value={products[1].name}
                                    category={activeCategory}
                                    onChange={(id, name) =>
                                        updateProduct(1, id, name)
                                    }
                                />
                            </>
                        )}

                        {products[1].id !== 0 && (
                            <>
                                <div className={styles.plusIcon}>
                                    <img src={Plus} alt="plus" width="50" />
                                </div>
                                <Search
                                    placeholder={t("home.searchPlaceholder3")}
                                    value={products[2].name}
                                    category={activeCategory}
                                    onChange={(id, name) =>
                                        updateProduct(2, id, name)
                                    }
                                />
                            </>
                        )}
                    </div>

                    <div className={styles.compareButtonWrapper}>
                        <button
                            className={styles.mainCompareBtn}
                            disabled={selectedProducts.length === 0}
                            onClick={handleCompare}
                        >
                            {t("home.compareBtn")}
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.cardsBg}>
                {compareData && compareData.length > 0 && (
                    <div
                        ref={compareRef}
                        className={styles.compareResults}
                        style={{ position: "relative", paddingBottom: "50px" }}
                    >
                        <div className={styles.favBtnWrapper}>
                            <button
                                className={styles.favBtnMain}
                                onClick={handleSaveToFavorites}
                            >
                                <img src={isFav ? favOn : favOff} alt="heart" />
                            </button>
                        </div>

                        {/* ДОБАВЛЕНА ОБЕРТКА ДЛЯ СКРОЛЛА */}
                        <div className={styles.cardsScrollWrapper}>
                            <div className={styles.compareCardsFlex}>
                                {compareData.map((item, index) => (
                                    <ShortCompareCard
                                        key={index}
                                        data={item}
                                        index={index}
                                    />
                                ))}
                            </div>
                        </div>

                        {compareData.length >= 2 && (
                            <div className={styles.actionButtons}>
                                <button
                                    className={styles.moreBtn}
                                    onClick={() =>
                                        navigate("/compare", {
                                            state: { products: compareData },
                                        })
                                    }
                                >
                                    {t("home.moreBtn")}
                                </button>

                                <button
                                    className={styles.aiBtn}
                                    onClick={() => setIsAiModalOpen(true)}
                                >
                                    {t("AI.ask")}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <AiModal
                isOpen={isAiModalOpen}
                onClose={() => setIsAiModalOpen(false)}
                productIds={compareData ? compareData.map((p) => p.id) : []}
            />

            <AdminAddProductModal
                isOpen={isAdminModalOpen}
                onClose={() => setIsAdminModalOpen(false)}
                categories={categoriesList}
                onProductAdded={handleProductAdded}
                onCreateCategory={handleCreateCategory}
            />

            <AdminDeleteProductModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onProductDeleted={() => {
                    console.log("Товар удален");
                }}
            />
        </main>
    );
}
