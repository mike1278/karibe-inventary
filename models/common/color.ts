export type Color = string

export const hexToRgb = (hex: Color | string) =>
  hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
    , (m, r, g, b) => '#' + r + r + g + g + b + b)
    .substring(1).match(/.{2}/g)
    .map(x => parseInt(x, 16))

export interface IColorSet {
  primary?: Color
  secondary?: Color
}
