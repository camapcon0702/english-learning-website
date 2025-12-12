export const usernameRegex = /^[a-zA-Z0-9_]+$/;

export const validateUsername = (value: string) => {
    if (!value) return "Tên đăng nhập không được để trống.";

    if (!usernameRegex.test(value)) {
        return "Tên đăng nhập không được chứa khoảng trắng hoặc ký tự đặc biệt.";
    }

    if (value.length < 4) {
        return "Tên đăng nhập phải có ít nhất 4 ký tự."
    }

    return "";
}