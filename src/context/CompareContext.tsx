import { createContext, useContext, useState } from "react";
import { type Product } from "../types/product";
import { type Category } from "../types/category";

interface CompareContextType {
    products: Product[];
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
    compareData: any[] | null;
    setCompareData: React.Dispatch<React.SetStateAction<any[] | null>>;
    activeCategory: Category | null;
    setActiveCategory: React.Dispatch<React.SetStateAction<Category | null>>;
    compareTrigger: number;
    setCompareTrigger: React.Dispatch<React.SetStateAction<number>>;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [products, setProducts] = useState<Product[]>([
        { id: 0, name: "" },
        { id: 0, name: "" },
        { id: 0, name: "" },
    ]);
    const [compareData, setCompareData] = useState<any[] | null>(null);
    const [activeCategory, setActiveCategory] = useState<Category | null>(null);
    const [compareTrigger, setCompareTrigger] = useState(0);

    return (
        <CompareContext.Provider
            value={{
                products,
                setProducts,
                compareData,
                setCompareData,
                activeCategory,
                setActiveCategory,
                compareTrigger,
                setCompareTrigger,
            }}
        >
            {children}
        </CompareContext.Provider>
    );
};

export const useCompare = () => {
    const context = useContext(CompareContext);
    if (!context) {
        throw new Error("useCompare must be used within a CompareProvider");
    }
    return context;
};
