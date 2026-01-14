export function arrayEquals<T1, T2>(arr1: T1[], arr2: T2[]) {
    if (arr1.length !== arr2.length) {
        return false;
    }

    const freq1 = new Map();
    const freq2 = new Map();

    for (let i = 0; i < arr1.length; i++) {
        const item = arr1[i];
        const count = freq1.get(item) || 0;
        freq1.set(item, count + 1);
    }

    for (let i = 0; i < arr2.length; i++) {
        const item = arr2[i];
        const count = freq2.get(item) || 0;
        freq2.set(item, count + 1);
    }

    if (freq1.size !== freq2.size) {
        return false;
    }

    for (const [key, value] of freq1) {
        if (freq2.get(key) !== value) {
            return false;
        }
    }

    return true;
}
