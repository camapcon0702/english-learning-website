export const validatePassword = (value: string) => {
    if (!value) return "Mật khẩu không được để trống.";

    if (value.length < 8) {
        return "Mật khẩu phải có ít nhất 8 ký tự.";
    }

    return "";
};
