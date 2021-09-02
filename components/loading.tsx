import React, { useMemo } from 'react'
import { useTheme } from '@geist-ui/react'
import { GeistUIThemesPalette } from '@geist-ui/react/esm/themes/presets'
import { NormalTypes } from '@geist-ui/react/esm/utils/prop-types'

const withDefaults = <P, DP>(component: React.ComponentType<P>, defaultProps: DP) => {
  type Props = Partial<DP> & Omit<P, keyof DP>
  component.defaultProps = defaultProps
  return component as React.ComponentType<Props>
}

interface Props {
  type?: NormalTypes
  color?: string
  width?: string
  height?: string
  fullWidth?: boolean
}

const defaultProps = {
  type: 'default' as NormalTypes,
}

type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof Props>
export type LoadingProps = Props & typeof defaultProps & NativeAttrs

const getIconBgColor = (
  type: NormalTypes,
  palette: GeistUIThemesPalette,
  color?: string,
) => {
  const colors: { [key in NormalTypes]: string } = {
    default: palette.accents_6,
    secondary: palette.secondary,
    success: palette.success,
    warning: palette.warning,
    error: palette.error,
  }

  return color ? color : colors[type]
}

const Loading: React.FC<React.PropsWithChildren<LoadingProps>> = ({
  children,
  type,
  color,
  fullWidth = true,
}) => {
  const theme = useTheme()
  const width = '4px'
  const bgColor = useMemo(() => getIconBgColor(type, theme.palette, color), [
    type,
    theme.palette,
    color,
  ])

  return (
    <div className="loading-container">
      <span className="loading">
        {children && <label>{children}</label>}
        <i />
        <i />
        <i />
      </span>
      <style jsx>{`
        .loading-container {
          display: inline-flex;
          align-items: center;
          position: relative;
          width: ${!fullWidth ? `calc(${width} * 10)` : '100%'};
          height: 100%;
        }
        label {
          margin-right: ${theme.layout.gapHalf};
          color: ${theme.palette.accents_5};
        }
        label :global(*) {
          margin: 0;
        }
        .loading {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: transparent;
          user-select: none;
        }
        i {
          width: ${width};
          height: ${width};
          border-radius: 50%;
          background-color: ${bgColor};
          margin: 0 1px;
          display: inline-block;
          animation: loading-blink 1.4s infinite both;
        }
        i:nth-child(2) {
          animation-delay: 0.2s;
        }
        i:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes loading-blink {
          0% {
            opacity: 0.2;
          }
          20% {
            opacity: 1;
          }
          100% {
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  )
}

const MemoLoading = React.memo(Loading)

export default withDefaults(MemoLoading, defaultProps)
