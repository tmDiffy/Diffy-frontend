import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    productService,
    type FavoriteEntry,
} from "../../api/services/product.service";
import styles from "./FavouritesPage.module.scss";

export function FavoritesPage() {
    const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [syncingId, setSyncingId] = useState<number | null>(null);

    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchFavs = async () => {
            try {
                const data = await productService.getFavorites();
                setFavorites(data);
            } catch (err) {
                console.error("Ошибка при получении избранного:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFavs();
    }, []);

    const handleGoToCompare = async (group: FavoriteEntry) => {
        setSyncingId(group.id);
        try {
            const ids = group.products.map((p) => p.id);
            const detailedData = await productService.compare(ids);

            navigate("/compare", { state: { products: detailedData } });
        } catch (err) {
            alert(t("favourites.errorLoadDetails") || "Ошибка загрузки данных");
        } finally {
            setSyncingId(null);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await productService.deleteFavorite(id);
            setFavorites((prev) => prev.filter((f) => f.id !== id));
        } catch (err) {
            alert(t("favourites.errorDelete") || "Ошибка при удалении");
        }
    };

    // Функция-помощник для отрисовки одного товара
    const renderProduct = (p: any) => (
        <div key={p.id} className={styles["fav-item-mini"]}>
            <div className={styles["fav-img-box"]}>
                <img src={p.img ?? ""} alt={p.name} />
            </div>
            <p className={styles["product-name"]}>{p.name}</p>
        </div>
    );

    if (loading) {
        return (
            <div className={styles["fav-page-wrapper"]}>
                <h2 className={styles["loading-text"]}>
                    {t("favourites.favLoading")}
                </h2>
            </div>
        );
    }

    return (
        <main className={styles["fav-page-wrapper"]}>
            <h1 className={styles["fav-title"]}>
                {t("favourites.favCompares")}
            </h1>

            <div className={styles["favorites-list"]}>
                {favorites.length === 0 ? (
                    <p className={styles["no-data"]}>
                        {t("favourites.noneFavouriteCompares")}
                    </p>
                ) : (
                    favorites.map((group) => {
                        const isThisLoading = syncingId === group.id;
                        const prods = group.products;

                        return (
                            <div
                                key={group.id}
                                className={styles["fav-group-card"]}
                            >
                                <button
                                    className={styles["delete-fav-icon"]}
                                    onClick={() => handleDelete(group.id)}
                                >
                                    ×
                                </button>

                                {/* Контейнер для центровки товаров */}
                                <div
                                    className={styles["fav-products-container"]}
                                >
                                    {/* Если 2 товара (или меньше) */}
                                    {prods.length <= 2 && (
                                        <div className={styles["row-top"]}>
                                            {prods.map((p, idx) => (
                                                <div
                                                    key={p.id}
                                                    className={
                                                        styles["row-flex"]
                                                    }
                                                >
                                                    {renderProduct(p)}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Если 3 товара (Рисуем пирамиду) */}
                                    {prods.length === 3 && (
                                        <>
                                            <div className={styles["row-top"]}>
                                                {renderProduct(prods[0])}
                                                {renderProduct(prods[1])}
                                            </div>
                                            <div
                                                className={styles["row-bottom"]}
                                            >
                                                {renderProduct(prods[2])}
                                            </div>
                                        </>
                                    )}
                                </div>

                                <button
                                    className={styles["main-compare-btn"]}
                                    disabled={syncingId !== null}
                                    onClick={() => handleGoToCompare(group)}
                                    style={{
                                        opacity:
                                            syncingId !== null && !isThisLoading
                                                ? 0.5
                                                : 1,
                                    }}
                                >
                                    {isThisLoading
                                        ? t("favourites.charLoading")
                                        : t("favourites.details")}
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </main>
    );
}
