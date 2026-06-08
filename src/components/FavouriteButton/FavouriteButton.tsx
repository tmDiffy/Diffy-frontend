import favOff from "../../assets/icons/FavOff.svg";
import favOn from "../../assets/icons/FavOn.svg";
import styles from "./FavouriteButton.module.scss";
import { useState } from "react";

export function FavouriteButton({
    isFavourite,
    onClick,
}: {
    isFavourite: boolean;
    onClick: () => void;
}) {
    const [isFav, setIsFav] = useState(false);
    return (
        <button
            className={`${styles.favouriteButton} ${isFavourite ? styles.active : ""}`}
            onClick={onClick}
        >
            {isFavourite ? "Убрать из избранного" : "Добавить в избранное"}
        </button>
    );
}
