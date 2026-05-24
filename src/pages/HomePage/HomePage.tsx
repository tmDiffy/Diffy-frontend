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
import AdminModal from "../../components/AdminModal/AdminAddProductModal";

import favOff from "../../assets/icons/Favourite_button.svg";
import favOn from "../../assets/icons/Favourite_button_active.svg";
import Plus from "../../assets/icons/Plus.svg";
import CategoriesList from "../../features/Categories/CategoriesList";
import type { Category } from "../../types/category";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useAuth } from "../../context/AuthContext";

export function HomePage() {
    const { t } = useTranslation();
    const [products, setProducts] = useState<Product[]>([
        { id: 0, name: "" },
        { id: 0, name: "" },
        { id: 0, name: "" },
    ]);

    const [compareData, setCompareData] = useState<any[] | null>(null);
    const [isFav, setIsFav] = useState(false);
    const [activeCategory, setActiveCategory] = useState<Category | null>(null);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const updateProduct = (index: number, id: number, name: string) => {
        const updated = [...products];
        updated[index] = { id, name };
        setProducts(updated);
    };

    const selectedProducts = products.filter((p) => p.id !== 0);

    // const hasDuplicates = new Set(selectedProducts.map((p) => p.id)).size !== selectedProducts.length;

    const handleCompare = async () => {
        const selectedIds = products.filter((p) => p.id !== 0).map((p) => p.id);

        if (selectedIds.length === 0) {
            toast.warning(t("home.errorSelect"));
            return;
        }

        /*
    if (hasDuplicates) {
      toast.warning("Вы выбрали одинаковые товары для сравнения");
      return;
    } */

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
        <main>
            <div className={styles.searchBlock}>
                <div className={styles.categoriesHeader}>
                    <CategoriesList onSelect={handleCategorySelect} />
                    {user?.is_staff && (
                        <button
                            onClick={() => setIsAdminModalOpen(true)}
                            className={styles.arrowBtn}
                        >
                            +
                        </button>
                    )}
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
                        <button
                            className={styles.favBtnMain}
                            onClick={handleSaveToFavorites}
                        >
                            <img src={isFav ? favOn : favOff} alt="heart" />
                        </button>

                        <div className={styles.compareCardsFlex}>
                            {compareData.map((item, index) => (
                                <ShortCompareCard
                                    key={index}
                                    data={item}
                                    index={index}
                                />
                            ))}
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

            <AdminModal
                isOpen={isAdminModalOpen}
                onClose={() => setIsAdminModalOpen(false)}
                categories={["Смартфоны", "Ноутбуки", "Планшеты", "Консоли"]}
            />
        </main>
    );
}
