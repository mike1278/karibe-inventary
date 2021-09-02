import { CSSProperties, MouseEventHandler, ReactNode } from 'react'
import Link from '@/components/canonical-link'
import { UrlObject } from 'url'

enum typeColor {
  primary = 'border-fg-primary text-fg-primary hover:bg-fg-primary hover:text-bg-primary',
}

declare type Url = string | UrlObject

export type ButtonType = keyof typeof typeColor

export type ButtonProps = {
  rounded?: boolean
  icon?: ReactNode
  type?: ButtonType
  title?: string
  href?: Url
  className?: string
  style?: CSSProperties
  onClick?: MouseEventHandler<HTMLButtonElement>
  children?: ReactNode
  btnType?: 'button' | 'submit' | 'reset'
}

export const Button = (props: ButtonProps) => {
  const {
    rounded = false,
    title,
    type = 'primary',
    href,
    icon,
    onClick,
    children,
    style,
  } = props
  const classes = `bg-transparent ${rounded ? 'rounded-full' : ''} border-2 mb-[2px] py-2 px-5 duration-200 inline-flex items-center ${typeColor[type]} ${props.className ? props.className : ''}`

  const content = (
    <>
      {icon && (
        <span className="pr-2">{icon}</span>
      )}
      {title}
      {children}
    </>
  )

  return href ? (
    <Link className={classes} href={href} style={style}>
      {content}
    </Link>
  ) : (
    <button onClick={onClick} className={classes} style={style} type={props.btnType}>
      {content}
    </button>
  )
}
