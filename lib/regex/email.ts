export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (value: string) => {
    if (!value) return "Email không được để trống.";

    if (!emailRegex.test(value)) {
        return "Email không hợp lệ. Vui lòng nhập đúng định dạng.";
    }

    return "";
};
