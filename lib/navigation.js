export default function Navigation(data) {
  return [
    {
      titulo: 'Proveedores',
      href: '#',
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
          href: '#',
        },
      ],
    },
    {
      titulo: 'Movimientos',
      childrens: [
        {
          titulo: 'Generales',
          href: '#',
        },
        {
          titulo: 'Compras',
          href: '#',
        },
        {
          titulo: 'Ventas',
          href: '#',
        },
      ],
    },
  ]
}
