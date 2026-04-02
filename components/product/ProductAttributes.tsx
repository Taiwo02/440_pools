import { ProductSubItem } from "@/types/baletype";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "../ui/table/TableWrapper";

type Props = {
  productAttributes?: ProductSubItem;
  packageInfo?: ProductSubItem;
};

export const ProductAttributes = ({ productAttributes }: Props) => {
  const { title, headers, rows } = productAttributes!;

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>

        <div className="w-fit md:w-full overflow-x-auto">
          <Table className="w-full table-fixed md:table-auto">
            <TableHeader>
              <TableRow>
                {headers.map((header) => (
                  <TableColumn key={header} className="px-4 py-2 text-left">
                    {header}
                  </TableColumn>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="odd:bg-(--bg-surface) even:bg-(--bg-muted)">
                  {headers.map((header) => (
                    <TableCell key={header} className="px-4 py-2">
                      {row[header] || "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>  
    </div>
  )
}

export const PackagingInfo = ({ packageInfo }: Props) => {
  const { title: packageTitle, headers: packageHeaders, rows: packageRows } = packageInfo!;

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-4">{packageTitle}</h2>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {packageHeaders.map((header) => (
                  <TableColumn key={header} className="px-4 py-2 text-left">
                    {header}
                  </TableColumn>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {packageRows.map((row, rowIndex) => (
                <TableRow key={rowIndex} className="odd:bg-(--bg-surface) even:bg-(--bg-muted)">
                  {packageHeaders.map((header) => (
                    <TableCell key={header} className="px-4 py-2">
                      {row[header] || "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
