import Link, { LinkProps } from 'next/link'
import { PropsWithChildren, CSSProperties } from 'react'

export type CanonicalLinkProps = LinkProps & {
  title?: string
  style?: CSSProperties
  id?: string
  className?: string
  canonical?: boolean
}

const CanonicalLink = ({ canonical, href, children, ...props }: PropsWithChildren<CanonicalLinkProps>) => {
  return (
    <Link {...props} href={href}>
      <a {...props}>
        {children}
      </a>
    </Link>
  )
}

export default CanonicalLink
