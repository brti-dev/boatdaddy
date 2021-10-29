/**
 * Make all properties optional
 */
export type Partial<T> = {
  [Key in keyof T]?: T[Key]
}
