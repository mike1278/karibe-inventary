import type { Column } from 'react-table'
import { useTable } from 'react-table'

export type TableColumn<T extends Object = {}> = Column<T>

export type TableProps<T extends Object = {}> = {
  columns: Column<T>[]
  data: T[]
}

const Table = <T extends Object = {}>({ columns, data }: TableProps<T>) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data })

  return (
    <div className="rounded-lg bg-white shadow print:border print:shadow-none overflow-y-hidden overflow-x-auto">
      <table {...getTableProps()} className="divide-y min-w-full divide-gray-200 overflow-hidden table-auto">
        <thead className="bg-bg-secondary duration-150">
          {headerGroups.map((headerGroup) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
            >
              {headerGroup.headers.map((column) => (
                <th
                  className="text-xs tracking-wider py-3 px-6 uppercase"
                  {...column.getHeaderProps()}
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody
          className="divide-y divide-gray-200"
          {...getTableBodyProps()}
        >
          {rows.length ? (
            rows.map((row, i) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()} className="bg-bg-secondary duration-150 hover:bg-opacity-50">
                  {row.cells.map((cell) => (
                    <td
                      className="py-4 px-6 whitespace-nowrap"
                      {...cell.getCellProps()}
                    >
                      <div className="flex text-center text-sm justify-center items-center">
                        {cell.render('Cell')}
                      </div>
                    </td>
                  ))}
                </tr>
              )
            })
          ) : (
            <tr className="bg-bg-secondary">
              <td
                className="py-4 px-6 whitespace-nowrap"
                colSpan={columns.length}
              >
                <div className="flex text-center text-sm opacity-75 justify-center items-center">
                  No se encuentran registros
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Table
