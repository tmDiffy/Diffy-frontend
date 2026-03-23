import { useTranslation } from "react-i18next";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { Link, useNavigate } from "react-router-dom";
import "./ProfilePage.css";
import { useState } from "react";

export function ProfilePage() {
    const { user, logout } = useCurrentUser();
    const [avatar, setAvatar] = useState("../../../public/images/avatar.jpg");
    const [username, setUsername] = useState(user?.username);
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleChangeAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const imageUrl = URL.createObjectURL(file);
        setAvatar(imageUrl);
    };

    return (
        <div className="profile-block">
            <div className="profile-description">
                <h1>{user?.username}</h1>
                <img className="avatar" src={avatar} alt="Avatar" />
                <p>
                    {t("profile.email")}: {user?.email}
                </p>
            </div>

            <div className="profile-change">
                <label className="button">
                    {t("profile.changeAvatar")}

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleChangeAvatar}
                        hidden
                    />
                </label>

                <label className="button">{t("profile.changeUsername")}</label>

                {/* страничка с изменением хз либо на этой же сделать */}
                <Link to="/">
                    {t("profile.changePassword")}
                    {/* Изменить пароль */}
                </Link>
            </div>
        </div>
    );
}
