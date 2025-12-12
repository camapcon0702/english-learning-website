export const phoneRegex = /^\d{10,15}$/;

export const validatePhone = (value: string) => {
    if (!phoneRegex.test(value)) {
        return "Số điện thoại phải là số và có độ dài từ 10 đến 15 ký tự.";
    }

    return "";
};