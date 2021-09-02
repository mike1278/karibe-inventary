import { Color, IColorSet } from '@/models/common/color'

export interface IBrandColorThemes {
  normal?: IBrandColorSet
  dark?: IBrandColorSet
}

export interface IBrandColorSet {
  foreground?: IColorSet
  background?: IColorSet
}

export interface IBrandLayout {
  brandName?: string
  themes: IBrandColorThemes
}

export const getDefaultBrandLayout = (): IBrandLayout => {
  return {
    brandName: 'Karibe',
    themes: {
      normal: {
        foreground: {
          primary: '#4E9DEB',
          secondary: '#2b2b2b',
        },
        background: {
          primary: '#f5f4f4',
          secondary: '#ffffff',
        }
      },
      dark: {
        foreground: {
          primary: '#9AC7F4',
          secondary: '#f5f4f4'
        },
        background: {
          primary: '#2f2f2f',
          secondary: '#383838',
        }
      }
    }
  }
}
