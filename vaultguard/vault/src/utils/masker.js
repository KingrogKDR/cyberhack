export function maskValue(value) {
    if (typeof value !== 'string') return value;
    if (value.length < 5) return value; // no masking for short strings
    return value.slice(0, 2) + '*'.repeat(value.length - 4) + value.slice(-2);
}
