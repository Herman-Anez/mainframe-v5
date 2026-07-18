const BASE64_CHARS =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function bytesToBase64(bytes: Uint8Array): string {
    let out = "";
    for (let i = 0; i < bytes.length; i += 3) {
        const b0 = bytes[i];
        const b1 = bytes[i + 1];
        const b2 = bytes[i + 2];
        out += BASE64_CHARS[b0 >> 2];
        out += BASE64_CHARS[((b0 & 3) << 4) | (b1 === undefined ? 0 : b1 >> 4)];
        out +=
            b1 === undefined
                ? "="
                : BASE64_CHARS[
                ((b1 & 15) << 2) | (b2 === undefined ? 0 : b2 >> 6)
                ];
        out += b2 === undefined ? "=" : BASE64_CHARS[b2 & 63];
    }
    return out;
}
