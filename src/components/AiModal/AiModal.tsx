import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import styles from "./AiModal.module.scss";
import { productService } from "../../api/services/product.service";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    productIds: number[];
};

export default function AiModal({ isOpen, onClose, productIds }: Props) {
    const [summary, setSummary] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen || productIds.length === 0) return;

        const fetchAiData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await productService.getAiSummary(productIds);
                setSummary(data.summary);
            } catch (err) {
                setError("Не удалось получить ответ от ИИ. Попробуйте позже.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAiData();
    }, [isOpen, productIds]);

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>ИИ Анализ товаров</h2>
                    <button className={styles.closeBtn} onClick={onClose}>
                        &times;
                    </button>
                </div>

                <div className={styles.content}>
                    {isLoading && (
                        <div className={styles.loader}>
                            ИИ анализирует товары, подождите немного...
                        </div>
                    )}

                    {error && <div className={styles.error}>{error}</div>}

                    {!isLoading && !error && summary && (
                        <div className={styles.markdownBody}>
                            <ReactMarkdown>{summary}</ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
