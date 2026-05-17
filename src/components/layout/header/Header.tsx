import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useClickOutside } from "../../../hooks/useClickOutside";
import { useCurrentUser } from "../../../hooks/useCurrentUser";

import Logo from "../../../assets/icons/Diffy.svg";
import Favorites from "../../../assets/icons/Favourite.svg";
import User from "../../../assets/icons/User.svg";

import styles from "./Header.module.scss";

export default function Header() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const { user, logout } = useCurrentUser();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useClickOutside(dropdownRef, () => setIsDropdownOpen(false));

    const toggleLanguage = () => {
        const newLang = i18n.language === "ru" ? "en" : "ru";
        i18n.changeLanguage(newLang);
    };

    const handleUserClick = (e: React.MouseEvent) => {
        if (!user) {
            navigate("/login");
        } else {
            e.preventDefault();
            setIsDropdownOpen(!isDropdownOpen);
        }
    };

    const onLogoutClick = () => {
        logout();
        setIsDropdownOpen(false);
    };

    return (
        <header className={styles.mainHeader}>
            <nav className={styles.headerNav}>
                <Link to="/" className={styles.logoLink}>
                    <img src={Logo} alt="Diffy" />
                </Link>

                {/* Единый блок "пилюля" для действий */}
                <div className={styles.actionsPill}>
                    <button
                        onClick={toggleLanguage}
                        className={styles.langBtn}
                        title="Change Language"
                    >
                        {i18n.language.toUpperCase()}
                    </button>

                    <Link
                        to={user ? "/favorites" : "/login"}
                        className={styles.iconBtn}
                        title={t("nav.favorites")}
                    >
                        <img src={Favorites} alt="Favorites" />
                    </Link>

                    <div
                        className={styles.userProfileContainer}
                        ref={dropdownRef}
                    >
                        <button
                            onClick={handleUserClick}
                            className={styles.iconBtn}
                        >
                            <img src={User} alt="Profile" />
                        </button>

                        {user && isDropdownOpen && (
                            <div className={styles.accountDropdown}>
                                <div className={styles.dropdownEmail}>
                                    {user.email}
                                </div>

                                <Link
                                    to="/profile"
                                    className={styles.dropdownItem}
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    <img
                                        src={User}
                                        alt=""
                                        className={styles.dropdownIcon}
                                    />
                                    {t("user.manageAccount")}
                                </Link>

                                <button
                                    onClick={onLogoutClick}
                                    className={`${styles.dropdownItem} ${styles.logoutBtn}`}
                                >
                                    <span className={styles.logoutIcon}>
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                            <polyline points="16 17 21 12 16 7" />
                                            <line
                                                x1="21"
                                                y1="12"
                                                x2="9"
                                                y2="12"
                                            />
                                        </svg>
                                    </span>
                                    {t("user.logout")}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}
