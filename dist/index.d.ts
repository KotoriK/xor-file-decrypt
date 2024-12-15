/**
 * 尝试得到异或加密使用的key
 * @param {ArrayBuffer} buf
 * @returns {number | undefined} key
 */
export function tryGetKey(buf: ArrayBuffer): number | undefined;
/**
 * 根据key对buf逐字节进行异或处理
 *
 * @param {ArrayBuffer} buf
 * @param {number} key
 * @returns {ArrayBuffer}
 */
export function xor(buf: ArrayBuffer, key: number): ArrayBuffer;
