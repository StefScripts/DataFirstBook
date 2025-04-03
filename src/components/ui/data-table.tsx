import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DataTableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessor: keyof T;
    cell?: (item: T) => React.ReactNode;
  }[];
}

export function DataTable<T>({ data, columns }: DataTableProps<T>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={String(column.accessor)}>{column.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <TableRow key={index}>
            {columns.map((column) => (
              <TableCell key={String(column.accessor)}>
                {column.cell ? column.cell(item) : String(item[column.accessor])}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
