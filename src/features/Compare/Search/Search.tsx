import { useEffect, useState, useRef } from "react";
import { productService } from "../../../api/services/product.service";
import { type Product } from "../../../types/product";
import styles from "./Search.module.scss";
import type { Category } from "../../../types/category";

type SearchProps = {
    placeholder: string;
    value: string;
    category: Category | null;
    onChange: (id: number, name: string) => void;
};

export default function Search({
    placeholder,
    value,
    category,
    onChange,
}: SearchProps) {
    const [results, setResults] = useState<Product[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!value.trim()) {
            setResults([]);
            return;
        }

        const timeout = setTimeout(async () => {
            try {
                const data = await productService.searchProduct(
                    value,
                    category,
                );
                setResults(data.results);
            } catch (e) {
                console.error(e);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        onChange(0, e.target.value);
        setIsOpen(true);
    }

    function handleSelect(product: Product) {
        onChange(product.id, product.name);
        setIsOpen(false);
    }

    return (
        <div className={styles.searchWrapper} ref={wrapperRef}>
            <input
                type="search"
                placeholder={placeholder}
                value={value}
                onChange={handleInputChange}
                onFocus={() => setIsOpen(true)}
                className={styles.searchInput}
            />

            {isOpen && results.length > 0 && (
                <ul className={styles.searchDropdown}>
                    {results.map((p) => (
                        <li
                            className={styles.productDropdown}
                            key={p.id}
                            onClick={() => handleSelect(p)}
                        >
                            <img
                                className={styles.productImage}
                                src={p.img ?? undefined}
                                alt={p.name}
                            />
                            {p.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
