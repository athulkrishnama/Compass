export function removeCookie(name: string) {
    const cookieString = name + "=; max-age=-60";
    document.cookie = cookieString;
}
