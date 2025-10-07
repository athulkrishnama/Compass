import type React from "react";

interface header<data> {
    id: string;
    label: string;
    render: (row: data) => React.ReactNode;
}

interface propType<data> {
    headers: header<data>[];
    data: data[];
}
function Table<T>({ headers, data }: propType<T>) {
    return (
<div className="w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
  <table className="w-full border-collapse text-sm text-left">
    <thead className="bg-gray-100 text-gray-700 uppercase tracking-wide text-xs border-b border-gray-200">
      <tr>
        {headers.map((header) => (
          <th
            key={header.id}
            className="px-6 py-3 font-semibold whitespace-nowrap"
          >
            {header.label}
          </th>
        ))}
      </tr>
    </thead>

    <tbody className="divide-y divide-gray-100">
      {data.length > 0 ? (
        data.map((row, index) => (
          <tr
            key={index}
            className="hover:bg-gray-50 transition-colors duration-150"
          >
            {headers.map((header) => (
              <td
                key={header.id}
                className="px-6 py-4 text-gray-800 whitespace-nowrap"
              >
                {header.render(row)}
              </td>
            ))}
          </tr>
        ))
      ) : (
        <tr>
          <td
            colSpan={headers.length}
            className="text-center text-gray-500 py-8"
          >
            No data available
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

    );
}

export default Table;
