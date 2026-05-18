import styles from "./ShortCompareCard.module.scss";
import { type Product } from "../../../types/product";

type Props = {
    data: Product;
    index?: number; // Делаем полноценно опциональным
};

export default function ShortCompareCard({ data, index = 0 }: Props) {
    if (!data) return null;

    const isLightCard = index % 2 !== 0;

    const cardClassName = `${styles.cardBase} ${isLightCard ? styles.themeLight : ""}`;

    return (
        <div className={cardClassName}>
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
