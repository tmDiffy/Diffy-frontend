import { apiClient } from "../apiClient";

export const langService = {
    postCurrentLanguage: (lang: string) =>
        apiClient.post("/accounts/set_language/", { lang: lang }),
};
