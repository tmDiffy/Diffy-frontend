import styles from "./ShortCompareCard.module.scss";
import { type Product } from "../../../types/product"; // Импортируем ваш тип вместо any

type Props = {
    data: Product;
    bg?: string; // Сделал опциональным на всякий случай
};

export default function ShortCompareCard({ data, bg }: Props) {
    if (!data) return null;

    return (
        // Склеиваем локальный класс стилей и внешний класс bg (если он передан)
        <div className={`${styles.card} ${bg || ""}`.trim()}>
            <div className={styles.imageWrapper}>
                {data.img && (
                    <img
                        className={styles.image}
                        src={data.img}
                        alt={data.name}
                        loading="lazy"
                    />
                )}
            </div>

            <h3 className={styles.title}>{data.name}</h3>
            <h4 className={styles.subtitle}>Характеристики</h4>

            <div className={styles.characteristicsList}>
                {data.characteristics_groups?.map((group) => (
                    <div key={group.name} className={styles.block}>
                        {group.characteristics.map((c) => (
                            <div key={c.id} className={styles.char}>
                                <span className={styles.charName}>
                                    {c.name}
                                </span>
                                <span className={styles.charValue}>
                                    {c.value}
                                </span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
