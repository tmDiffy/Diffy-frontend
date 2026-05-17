import { useEffect, useState } from "react";
import styles from "./CategoriesList.module.scss";
import { productService } from "../../api/services/product.service";
import type { Category } from "../../types/category";

type CategoriesListProps = {
    onSelect: (category: Category | null) => void;
};

export default function CategoriesList({ onSelect }: CategoriesListProps) {
    const [activeCategory, setActiveCategory] = useState<Category | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [startIndex, setStartIndex] = useState(0);

    // 1. Добавляем стейт для отслеживания загрузки
    const [isLoading, setIsLoading] = useState(true);

    const visibleCount = 4;
    const maxIndex = Math.max(0, categories.length - visibleCount);

    const handlePrev = () => {
        setStartIndex((prev) => {
            const nextValue = prev - visibleCount;
            return nextValue < 0 ? maxIndex : nextValue;
        });
    };
    const handleNext = () => {
        setStartIndex((prev) => {
            const nextValue = prev + visibleCount;
            return nextValue > maxIndex ? 0 : nextValue;
        });
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
    }, []);

    return (
        <div className={styles.wrapper}>
            <button
                className={styles.arrowBtn}
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
                        transform: `translateX(calc(-${startIndex} * ((100% + 12px) / ${visibleCount})))`,
                    }}
                >
                    {isLoading
                        ? Array.from({ length: visibleCount }).map(
                              (_, index) => (
                                  <li
                                      key={`skeleton-${index}`}
                                      className={styles.listItem}
                                  >
                                      <div
                                          className={`${styles.categoryBtn} ${styles.skeleton}`}
                                      ></div>
                                  </li>
                              ),
                          )
                        : categories.map((category) => (
                              <li key={category.id} className={styles.listItem}>
                                  <button
                                      className={`${styles.categoryBtn} ${
                                          activeCategory?.id === category.id
                                              ? styles.active
                                              : ""
                                      }`}
                                      onClick={() => {
                                          if (
                                              activeCategory?.id === category.id
                                          ) {
                                              setActiveCategory(null);
                                              onSelect(null);
                                          } else {
                                              setActiveCategory(category);
                                              onSelect(category);
                                          }
                                      }}
                                  >
                                      {category.name}
                                  </button>
                              </li>
                          ))}
                </ul>
            </div>

            <button
                className={styles.arrowBtn}
                onClick={handleNext}
                disabled={startIndex === maxIndex || isLoading}
                aria-label="Вперед"
            >
                &gt;
            </button>
        </div>
    );
}
