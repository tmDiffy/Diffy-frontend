import { useTranslation } from "react-i18next";
import styles from "./Footer.module.scss";
import LogoWhite from "../../../assets/icons/White_Diffy.svg";

export default function Footer() {
    const { t } = useTranslation();

    return (
        <footer>
            <div className={styles.footerContainer}>
                <div className={styles.footerLogoSection}>
                    <a href="/" className={styles.footerLogo}>
                        <img src={LogoWhite} alt="Logo" />
                    </a>
                </div>

                <div>
                    <ul>
                        <li>
                            <h3 className={styles.footerHeader}>
                                {t("footer.support")}
                            </h3>
                        </li>
                        <li>
                            <a
                                href="mailto:diffy@gmail.com"
                                className={styles.footerText}
                            >
                                diffy@gmail.com
                            </a>
                        </li>
                        <li>
                            <p className={styles.footerText}>
                                +7-123-456-78-90
                            </p>
                        </li>
                    </ul>
                </div>

                <div>
                    <ul>
                        <li>
                            <h3 className={styles.footerHeader}>
                                {t("footer.account")}
                            </h3>
                        </li>
                        <li>
                            <a href="/" className={styles.footerText}>
                                {t("footer.myAccount")}
                            </a>
                        </li>
                        <li>
                            <a href="/register" className={styles.footerText}>
                                {t("footer.signInUp")}
                            </a>
                        </li>
                    </ul>
                </div>

                <div>
                    <ul>
                        <li>
                            <h3 className={styles.footerHeader}>
                                {t("footer.aboutUs")}
                            </h3>
                        </li>
                        <li>
                            <a href="/" className={styles.footerText}>
                                {t("footer.privacyPolicy")}
                            </a>
                        </li>
                        <li>
                            <a href="/" className={styles.footerText}>
                                FAQ
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}
