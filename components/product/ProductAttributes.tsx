import { ProductSubItem } from "@/types/baletype";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "../ui/table/TableWrapper";
import { FiInbox, FiInfo } from "react-icons/fi";

type Props = {
  productAttributes?: ProductSubItem | null;
  packageInfo?: ProductSubItem | null;
};

export const ProductAttributes = ({ productAttributes }: Props) => {
  if(productAttributes == null) {
    return (
      <div className="my-16 flex flex-col justify-center items-center gap-4">
        <FiInfo size={40} className="text-red-400" />
        <div className="text-center">
          <h2 className="mb-1 text-lg">No Product Specifications</h2>
          <p>There are no specifications for this product</p>
        </div>
      </div>
    )
  }

  if(productAttributes != null) {
    const { title, headers, rows } = productAttributes!;

    return (
      <div className="w-full">
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">{title}</h2>

          <div className="overflow-x-auto">
            <Table>
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
}

export const PackagingInfo = ({ packageInfo }: Props) => {
  if(packageInfo == null) {
    return (
      <div className="my-16 flex flex-col justify-center items-center gap-4">
        <FiInbox size={40} className="text-red-400" />
        <div className="text-center">
          <h2 className="mb-1 text-lg">No Package Information</h2>
          <p>There is no package information for this product</p>
        </div>
      </div>
    )
  }

  if(packageInfo != null) {
    const { title: packageTitle, headers: packageHeaders, rows: packageRows } = packageInfo!;

    return (
      <div className="w-full">
        <div className="mb-8">
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
}
