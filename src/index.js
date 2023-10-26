/**
 * 已知的图片魔数
 * @type {Uint8Array[]}
 */
const KNOWN_IMAGE_MAGIC_NUMBER = [
    new Uint8Array([0xff, 0xd8, 0xff]), // JPEG

    new Uint8Array([0x89, 0x50, 0x4e, 0x47]), // PNG
    new Uint8Array([0x47, 0x49, 0x46, 0x38]), // GIF
    new Uint8Array([0x49, 0x49, 0x2a, 0x00]), // TIFF
    new Uint8Array([0x4d, 0x4d, 0x00, 0x2a]), // TIFF

    new Uint8Array([0x00, 0x00, 0x01, 0x00]), // ICO
    new Uint8Array([0x00, 0x00, 0x02, 0x00]), // ICO
    new Uint8Array([0x42, 0x50, 0x47, 0xfb]), // BPG
    new Uint8Array([0x46, 0x4f, 0x52, 0x4d]), // HEIF

    new Uint8Array([0x52, 0x49, 0x46, 0x46]), // WEBP

]
const MAX_MAGIC_NUMBER_LENGTH = Math.max(...KNOWN_IMAGE_MAGIC_NUMBER.map(v => v.length))
/**
 * 尝试得到异或加密使用的key
 * @param {ArrayBuffer} buf 
 * @returns {number | undefined} key
 */

export function tryGetKey(buf) {
    const header = new Uint8Array(buf.slice(0, MAX_MAGIC_NUMBER_LENGTH))
    // key长度一般为1个字节
    // 查找异或后重复超过2次的字节
    const xorResult = new Uint8Array(MAX_MAGIC_NUMBER_LENGTH)
    /**
     * @type {number | undefined}
     */
    let lastMagicNumberLength
    magicNumberIterate: for (const magicNumber of KNOWN_IMAGE_MAGIC_NUMBER) {
        if (typeof lastMagicNumberLength === 'number' && lastMagicNumberLength !== magicNumber.length) {
            // 清空xorResult
            for (let i = 0; i < magicNumber.length; i++) {
                xorResult[i] = 0
            }
        }
        lastMagicNumberLength = magicNumber.length
        for (let i = 0; i < magicNumber.length; i++) {
            xorResult[i] = header[i] ^ magicNumber[i]
        }
        const keyPossible = xorResult[0]

        for (let i = 1; i < magicNumber.length; i++) {
            if (xorResult[i] !== keyPossible) {
                continue magicNumberIterate
            }
        }
        return keyPossible
    }

}
/**
 * 根据key对buf逐字节进行异或处理
 * 
 * @param {ArrayBuffer} buf 
 * @param {number} key 
 * @returns {ArrayBufferLike}
 */
export function xor(buf, key) {
    const result = new Uint8Array(buf.byteLength)
    const data = new Uint8Array(buf)
    for (let i = 0; i < data.length; i++) {
        result[i] = data[i] ^ key
    }
    return result.buffer
}

