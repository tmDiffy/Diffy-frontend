import { useState } from "react";
import styles from "./CategoriesList.module.scss";

// Расширил список, чтобы карусель было куда крутить
const CATEGORIES = [
    "Все категории",
    "Телефон",
    "Ноутбуки",
    "ПК",
    "ТВ",
    "Планшеты",
    "Часы",
    "Аудио",
    "Гаджеты",
    "f",
];

export default function CategoriesList() {
    const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);

    const [startIndex, setStartIndex] = useState(0);

    const visibleCount = 4;

    const maxIndex = Math.max(0, CATEGORIES.length - visibleCount);

    const handlePrev = () => {
        setStartIndex((prev) => Math.max(0, prev - 4));
    };

    const handleNext = () => {
        setStartIndex((prev) => Math.min(maxIndex, prev + 4));
    };

    return (
        <div className={styles.wrapper}>
            <button
                className={styles.arrowBtn}
                onClick={handlePrev}
                disabled={startIndex === 0}
                aria-label="Назад"
            >
                &lt;
            </button>

            <div className={styles.carouselViewport}>
                <ul
                    className={styles.list}
                    style={{
                        transform: `translateX(calc(-${startIndex} * ((100% + 12px) / 4)))`,
                    }}
                >
                    {CATEGORIES.map((category) => (
                        <li key={category} className={styles.listItem}>
                            <button
                                className={`${styles.categoryBtn} ${
                                    activeCategory === category
                                        ? styles.active
                                        : ""
                                }`}
                                onClick={() => setActiveCategory(category)}
                            >
                                {category}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <button
                className={styles.arrowBtn}
                onClick={handleNext}
                disabled={startIndex === maxIndex}
                aria-label="Вперед"
            >
                &gt;
            </button>
        </div>
    );
}
