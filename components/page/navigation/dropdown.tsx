import s from './styles/dropdown.module.css'
import Link from 'next/link'
import { ChevronDown16 } from '@carbon/icons-react'
import { ReactNode } from 'react'

export const CustomDropdown = ({titulo, links, children}: {
  titulo: string,
  links: {titulo: string, href?: string, isButton?: boolean, onClick?: any}[],
  children?: ReactNode
}) => (
  <div className={s.dropdown}>
    <div>
      {children}
      <div className={`${s.wrapper}`}>
        <div className={`${s.main}`}>
          <p className="font-bold text-right mb-4">{titulo}</p>
          {links.map((l, i) => (
            !l.isButton ? (
              <Link href={l.href} key={i}>
                <a className={s.navLink}>{l.titulo}</a>
              </Link>
            ) : (
              <button key={i} className={`${s.navLink} outline-none focus:outline-none`} onClick={l.onClick}>
                {l.titulo}
              </button>
            )
          ))}
        </div>
      </div>
    </div>
  </div>
)

const Dropdown = ({ titulo, links }: {
  titulo: string,
  links: { titulo: string, href: string }[],
}) => (
  <div className={s.dropdown}>
    <div>
      <button className={s.title}>
        <span>{titulo}</span>
        <div className={s.arrow}>
          <ChevronDown16 />
        </div>
      </button>
      <div className={s.wrapper}>
        <div className={s.main}>
          {links.map((l, i) => (
            <Link href={l.href} key={i}>
              <a className={s.navLink}>{l.titulo}</a>
            </Link>
          ))}
        </div>
      </div>
    </div>
  </div>
)

export default Dropdown
