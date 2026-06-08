import { Link } from "react-router-dom";
import styles from "./ErrorPage.module.scss";
import { useTranslation } from "react-i18next";

export function ErrorPage() {
    const t = useTranslation().t;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>404</h1>
            <p className={styles.message}>{t("error.notFound")}</p>
            <Link to="/" className={styles.homeBtn}>
                {t("error.homeButton")}
            </Link>
        </div>
    );
}
