import bcrypt from "bcrypt"

/**
 * 
 * @param value 
 * @returns 
 */
export async function hash(value: string) {
  const salt = 10

  const hash = await bcrypt.hash(value, salt)
  return hash
}

/**
 * 
 * @param value 
 * @param hash 
 * @returns 
 */
export async function verify(value: string, hash: string) {
  const isMatch = await bcrypt.compare(value, hash)
  return isMatch
}