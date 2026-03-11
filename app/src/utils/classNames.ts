export const classNames = (...tokens: Array<string | false | null | undefined>): string => {
  return tokens.filter(Boolean).join(' ')
}
