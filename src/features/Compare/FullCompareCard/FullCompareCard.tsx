import styles from "./FullCompareCard.module.scss";
import { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Добавили useNavigate
import { type Product } from "../../../types/product";
import AiModal from "../../../components/AiModal/AiModal";
import { useTranslation } from "react-i18next";
import { productService } from "../../../api/services/product.service";
import { toast } from "react-toastify";
import { useCompare } from "../../../context/CompareContext";
import { useAuth } from "../../../context/AuthContext"; // Добавили useAuth

// Импорт иконок
import favOff from "../../../assets/icons/FavOff.svg";
import favOn from "../../../assets/icons/FavOn.svg";

export function FullCompareCard() {
    const { t, i18n } = useTranslation();
    const { state } = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const { compareData, setCompareData } = useCompare();
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [isFav, setIsFav] = useState(false); // Состояние избранного

    const products: Product[] = compareData || state?.products || [];

    useEffect(() => {
        if (!products.length) return;

        const refreshCompareData = async () => {
            const productIds = products.map((p) => p.id);
            const toastId = toast.loading(
                t("home.loading") || "Обновление языка...",
            );

            try {
                const updatedData = await productService.compare(productIds);
                setCompareData(updatedData);
                setIsFav(false); // Сбрасываем иконку при обновлении данных/смене языка
                toast.dismiss(toastId);
            } catch (err) {
                console.error("Failed to refresh localized data:", err);
                toast.update(toastId, {
                    render: t("home.errorLoad") || "Ошибка обновления данных",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000,
                });
            }
        };

        refreshCompareData();
    }, [i18n.language]);

    // Функция сохранения в избранное
    const handleSaveToFavorites = async () => {
        if (!products.length) return;
        if (!user) {
            toast.warning(
                t("auth.loginRequired") ||
                    "Войдите в аккаунт, чтобы добавить в избранное",
            );
            navigate("/login", { state: { from: window.location.pathname } });
            return;
        }
        try {
            const ids = products.map((p) => p.id);
            await productService.saveToFavorites(ids);
            setIsFav(true);
            toast.success(
                t("home.alertSaved") || "Успешно сохранено в избранное!",
            );
        } catch (err: any) {
            toast.error(t("home.alertSaveError") || "Ошибка при сохранении");
        }
    };

    const dynamicSections = useMemo(() => {
        if (!products.length) return [];
        const groupsMap: { [key: string]: Set<string> } = {};

        products.forEach((product) => {
            product.characteristics_groups?.forEach((group) => {
                if (!groupsMap[group.name]) {
                    groupsMap[group.name] = new Set<string>();
                }
                group.characteristics?.forEach((char) => {
                    groupsMap[group.name].add(char.name);
                });
            });
        });

        return Object.entries(groupsMap).map(([title, fieldsSet]) => ({
            title,
            fields: Array.from(fieldsSet),
        }));
    }, [products]);

    if (!products.length) {
        return <p className={styles.noData}>{t("home.noData")}</p>;
    }

    const getChar = (product: Product, groupName: string, charName: string) => {
        const group = product.characteristics_groups?.find(
            (g) => g.name === groupName,
        );
        return (
            group?.characteristics?.find((c) => c.name === charName)?.value ||
            "—"
        );
    };

    function parseValue(str: string): number | null {
        if (!str || str === "—") return null;
        const cleaned = str.replace(/[^0-9.,]/g, "").replace(",", ".");
        const n = parseFloat(cleaned);
        return isNaN(n) ? null : n;
    }

    function getBestWorst(
        products: Product[],
        groupName: string,
        field: string,
    ) {
        const list = products.map((p) => {
            const raw = getChar(p, groupName, field);
            const num = parseValue(raw);
            return { id: p.id, raw, num };
        });

        const numeric = list.filter((v) => v.num !== null);
        if (!numeric.length) return { maxIds: [], minIds: [] };

        const firstNum = numeric[0].num;
        const allSame = numeric.every((v) => v.num === firstNum);

        if (allSame) return { maxIds: [], minIds: [] };

        const max = Math.max(...numeric.map((v) => v.num!));
        const min = Math.min(...numeric.map((v) => v.num!));

        return {
            maxIds: numeric.filter((v) => v.num === max).map((v) => v.id),
            minIds: numeric.filter((v) => v.num === min).map((v) => v.id),
        };
    }

    return (
        <main className={styles.comparePage}>
            {/* Кнопка добавлена над скролл-контейнером, чтобы оставаться на месте */}
            <div className={styles.favBtnWrapper}>
                <button
                    className={styles.favBtnMain}
                    onClick={handleSaveToFavorites}
                >
                    <img src={isFav ? favOn : favOff} alt="heart" />
                </button>
            </div>

            <div className={styles.scrollWrapper}>
                {/* Шапка таблицы */}
                <div className={styles.cards}>
                    <div className={styles.description}>
                        {products.map((p) => (
                            <div key={p.id} className={styles.product}>
                                <div className={styles.cardImageWrapper}>
                                    {p.img ? (
                                        <img
                                            src={p.img}
                                            alt={p.name}
                                            className={styles.cardImage}
                                        />
                                    ) : (
                                        <div
                                            className={styles.imagePlaceholder}
                                        />
                                    )}
                                </div>
                                <h3>{p.name}</h3>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Тело таблицы */}
                <div className={styles.full}>
                    <div className={styles.fullCard}>
                        {dynamicSections.map((section) => (
                            <div key={section.title} className={styles.section}>
                                <div className={styles.mainCharHeader}>
                                    <h2>{section.title}</h2>
                                </div>

                                {section.fields.map((field) => {
                                    const { maxIds, minIds } = getBestWorst(
                                        products,
                                        section.title,
                                        field,
                                    );

                                    return (
                                        <div
                                            key={field}
                                            className={styles.charRow}
                                        >
                                            <h4 className={styles.charHeader}>
                                                {field}
                                            </h4>

                                            <div className={styles.char}>
                                                {products.map((p) => {
                                                    const value = getChar(
                                                        p,
                                                        section.title,
                                                        field,
                                                    );

                                                    let valueClass =
                                                        styles.charValue;
                                                    if (maxIds.includes(p.id))
                                                        valueClass += ` ${styles.best}`;
                                                    if (minIds.includes(p.id))
                                                        valueClass += ` ${styles.worst}`;

                                                    return (
                                                        <p
                                                            key={p.id}
                                                            className={
                                                                valueClass
                                                            }
                                                        >
                                                            {value}
                                                        </p>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.aiBtnWrapper}>
                    <button
                        className={styles.aiBtnBig}
                        onClick={() => setIsAiModalOpen(true)}
                    >
                        {t("AI.ask") || "Спросить ИИ"}
                    </button>
                </div>
            </div>

            <AiModal
                isOpen={isAiModalOpen}
                onClose={() => setIsAiModalOpen(false)}
                productIds={products.map((p) => p.id)}
            />
        </main>
    );
}
