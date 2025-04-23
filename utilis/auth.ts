export const logout = () => {
    document.cookie = "auth-token=; expires=Thu, 1 Jan 1970 00:00:00 UTC;"
    window.location.href = "/signin";
}