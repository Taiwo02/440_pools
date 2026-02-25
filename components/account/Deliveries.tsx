"use client"

import { useGetDeliveries } from "@/api/order"
import { useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TablePagination, TableRow } from '../ui/table/TableWrapper';
import { Badge, Button, Dropdown } from '../ui';
import { DeliveryPayload } from "@/types/types";

const Deliveries = () => {
  const { data: deliveries = [], isPending: isDeliveryLoading } = useGetDeliveries();

  useEffect(() => {
    if (deliveries) console.log(deliveries);
  }, [deliveries]);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, deliveries.length);

  const paginatedData = deliveries.slice(startIndex, endIndex);

  const totalPages = Math.ceil(deliveries.length / rowsPerPage);
  
  return (
    <div>
      <Table aria-label='Order History Table' pageSize={rowsPerPage} className='border border-(--border-default)'>
        <TableHeader>
          <TableRow>
            <TableColumn>Firstname</TableColumn>
            <TableColumn>Lastname</TableColumn>
            <TableColumn>Phone</TableColumn>
            <TableColumn>Additional Phone</TableColumn>
            <TableColumn>Address</TableColumn>
            <TableColumn>Additional Info</TableColumn>
            <TableColumn>Region</TableColumn>
            <TableColumn>City</TableColumn>
            <TableColumn>State</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableRow>
        </TableHeader>
        <TableBody isLoading={isDeliveryLoading}>
          {
            paginatedData.map((delivery: DeliveryPayload) => (
              <TableRow key={delivery.id}>
                <TableCell>{delivery.firstName}</TableCell>
                <TableCell>{delivery.LastName}</TableCell>
                <TableCell>{delivery.phone}</TableCell>
                <TableCell>{delivery.additionalPhone}</TableCell>
                <TableCell>{delivery.address}</TableCell>
                <TableCell>{delivery.additionalInfo}</TableCell>
                <TableCell>{delivery.region}</TableCell>
                <TableCell>{delivery.city}</TableCell>
                <TableCell>{delivery.state}</TableCell>
                <TableCell>
                  {
                    !delivery.setDefault ? 
                      <Button className='py-1! px-2! text-sm rounded! text-nowrap'>
                        Set Default
                      </Button> :
                      <Button className='py-1! px-2! text-sm rounded! text-nowrap'>
                        Unset Default
                      </Button>
                  }
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
      <TablePagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        startIndex={startIndex + 1}
        endIndex={endIndex}
        totalItems={deliveries.length}
        itemLabel="deliveries"
      />
    </div>
  )
}

export default Deliveries
