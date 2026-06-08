import { useEffect, useState } from "react";
import styles from "./CategoriesList.module.scss";
import { productService } from "../../api/services/product.service";
import type { Category } from "../../types/category";
import { useTranslation } from "react-i18next";
import { useCompare } from "../../context/CompareContext"; // Используем контекст

type CategoriesListProps = {
    onSelect: (category: Category | null) => void;
};

export default function CategoriesList({ onSelect }: CategoriesListProps) {
    const { i18n } = useTranslation();

    // Синхронизируем с контекстом, чтобы состояние не терялось
    const { activeCategory, setActiveCategory } = useCompare();

    const [categories, setCategories] = useState<Category[]>([]);
    const [startIndex, setStartIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Динамический расчет видимых элементов в зависимости от экрана
    const [visibleCount, setVisibleCount] = useState(4);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 480) setVisibleCount(1);
            else if (window.innerWidth <= 768) setVisibleCount(2);
            else if (window.innerWidth <= 1024) setVisibleCount(3);
            else setVisibleCount(4);
        };

        handleResize(); // Инициализация
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const maxIndex = Math.max(0, categories.length - visibleCount);

    const handlePrev = () => {
        setStartIndex((prev) => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setStartIndex((prev) => Math.min(maxIndex, prev + 1));
    };

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true);
            try {
                const fetchedCategories =
                    await productService.getAllCategories();
                setCategories(fetchedCategories);
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, [i18n.language]);

    // При изменении размера экрана сбрасываем индекс, чтобы верстка не улетала
    useEffect(() => {
        if (startIndex > maxIndex) {
            setStartIndex(maxIndex);
        }
    }, [visibleCount, maxIndex, startIndex]);

    const handleCategoryClick = (category: Category) => {
        if (activeCategory?.id === category.id) {
            setActiveCategory(null);
            onSelect(null);
        } else {
            setActiveCategory(category);
            onSelect(category);
        }
    };

    return (
        <div className={styles.wrapper}>
            <button
                className={`${styles.arrowBtn} ${styles.prevBtn}`}
                onClick={handlePrev}
                disabled={startIndex === 0 || isLoading}
                aria-label="Назад"
            >
                &lt;
            </button>

            <div className={styles.carouselViewport}>
                <ul
                    className={styles.list}
                    style={{
                        transform: `translateX(calc(-${startIndex} * (100% / ${visibleCount})))`,
                    }}
                >
                    {isLoading
                        ? Array.from({ length: 4 }).map((_, index) => (
                              <li
                                  key={`skeleton-${index}`}
                                  className={styles.listItem}
                                  style={{
                                      flex: `0 0 calc(100% / ${visibleCount})`,
                                  }}
                              >
                                  <div className={styles.paddingWrapper}>
                                      <div
                                          className={`${styles.categoryBtn} ${styles.skeleton}`}
                                      ></div>
                                  </div>
                              </li>
                          ))
                        : categories.map((category) => (
                              <li
                                  key={category.id}
                                  className={styles.listItem}
                                  style={{
                                      flex: `0 0 calc(100% / ${visibleCount})`,
                                  }}
                              >
                                  <div className={styles.paddingWrapper}>
                                      <button
                                          className={`${styles.categoryBtn} ${
                                              activeCategory?.id === category.id
                                                  ? styles.active
                                                  : ""
                                          }`}
                                          onClick={() =>
                                              handleCategoryClick(category)
                                          }
                                      >
                                          {category.name}
                                      </button>
                                  </div>
                              </li>
                          ))}
                </ul>
            </div>

            <button
                className={`${styles.arrowBtn} ${styles.nextBtn}`}
                onClick={handleNext}
                disabled={startIndex >= maxIndex || isLoading}
                aria-label="Вперед"
            >
                &gt;
            </button>
        </div>
    );
}
