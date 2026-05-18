import styles from "./FullCompareCard.module.scss";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { type Product } from "../../../types/product";
import AiModal from "../../../components/AiModal/AiModal";
import { t } from "i18next";

// Раскомментируйте, если будете использовать кнопки избранного
// import favOff from "../../../assets/icons/Favourite_button.svg";
// import favOn from "../../../assets/icons/Favourite_button_active.svg";

export function FullCompareCard() {
    const { state } = useLocation();
    const products: Product[] = state?.products || [];

    const [isFav, setIsFav] = useState(false);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);

    if (!products.length) {
        return <p className={styles.noData}>Нет данных для сравнения</p>;
    }

    const getChar = (product: Product, charName: string) => {
        return (
            product.characteristics_groups
                ?.flatMap((g) => g.characteristics)
                .find((c) => c.name === charName)?.value || "—"
        );
    };

    function parseValue(str: string): number | null {
        if (!str) return null;
        const n = parseFloat(str.replace(",", "."));
        return isNaN(n) ? null : n;
    }

    function getBestWorst(products: Product[], field: string) {
        const list = products.map((p) => {
            const raw = getChar(p, field);
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

    const sections = [
        {
            title: "Размеры",
            fields: ["Ширина", "Высота", "Толщина", "Вес"],
        },
        {
            title: "Корпус",
            fields: [
                "Материал задней панели",
                "Материал граней",
                "Пыле-влагозащита",
            ],
        },
        {
            title: "Дисплей",
            fields: [
                "Тип экрана",
                "Диагональ экрана",
                "Разрешение экрана",
                "Частота экрана",
                "Яркость экрана",
                "Плотность пикселей",
                "Соотношение сторон",
            ],
        },
        {
            title: "Процессор",
            fields: ["Модель процессора", "Количество ядер"],
        },
        { title: "Батарея", fields: ["Аккумулятор"] },
        {
            title: "Основная камера",
            fields: ["Количество камер", "Количество мегапикселей"],
        },
        { title: "Фронтальная камера", fields: ["Фронтальная камера"] },
        { title: "Операционная система", fields: ["Операционная система"] },
        { title: "Bluetooth", fields: ["Bluetooth"] },
    ];

    return (
        <main className={styles.comparePage}>
            {/* Обертка для горизонтального скролла на мобильных */}
            <div className={styles.scrollWrapper}>
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

                <div className={styles.full}>
                    <div className={styles.fullCard}>
                        {sections.map((section) => (
                            <div key={section.title} className={styles.section}>
                                <div className={styles.mainCharHeader}>
                                    <h2>{section.title}</h2>
                                </div>

                                {section.fields.map((field) => {
                                    const { maxIds, minIds } = getBestWorst(
                                        products,
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
                                                        field,
                                                    );

                                                    // Собираем классы
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
                        {t("AI.ask")}
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
