import IProfileTranslations from "@/translations/types/profile.translations.types";

const frProfileTranslations: IProfileTranslations = {
    tabs: {
        profile: "",
        history: ""
    },
    profileTab: {
        username: "",
        email: "",
        imageUrl: "",
        button: {
            save: "",
            changePass: "",
            deleteAccount: ""
        },
        changeModal: {
            oldPass: "",
            newPass: "",
            confirmPass: ""
        },
        deleteModal: {
            confirm: "",
            pass: "",
            button: ""
        }
    },
    toasts: {
        changePass: {
            success: "",
            error: ""
        },
        deleteAccount: {
            success: "",
            error: ""
        }
    }
};

export default frProfileTranslations;
