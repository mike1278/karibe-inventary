export default function Navigation(data) {
  return [
    {
      titulo: 'Inicio',
      href: '/',
    },
    {
      titulo: 'Inventario',
      childrens: [
        {
          titulo: 'Categorías',
          href: '/categories',
        },
        {
          titulo: 'Productos',
          href: '/products',
        },
      ],
    },
    {
      titulo: 'Movimientos',
      childrens: [
        {
          titulo: 'Entradas',
          href: '/inputs',
        },
        {
          titulo: 'Salidas',
          href: '/outs',
        },
      ],
    },
  ]
}
