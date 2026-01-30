import { Badge, Button } from '@/components/ui'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@/components/ui/table/TableWrapper'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { BsGraphDownArrow } from 'react-icons/bs'
import { LuGitGraph } from 'react-icons/lu'
import { RiArrowRightLine, RiCheckboxCircleFill, RiCurrencyFill, RiMessage2Line, RiShieldCheckFill } from 'react-icons/ri'

const Cart = () => {
  const image = "https://picsum.photos/seed/sensor-module/600/600"
  return (
    <section className='pt-24 mb-10 md:mb-16'>
      <div className="px-4 md:px-10 lg:px-20">
        <div className="flex flex-col md:flex-row gap-4 justify-between md:items-end">
          <div>
            <h1 className="text-2xl md:text-4xl">Shopping Cart</h1>
            <p className='text-(--primary)/80'>3 items from 2 suppliers</p>
          </div>
          <div className="flex gap-2 items-center">
            <Button className='bg-red-800'>
              Delete Selected
            </Button>
            <Button primary>
              Select All Items
            </Button>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 my-4">
          <div className="w-full lg:basis-3/4 flex flex-col gap-4">
            <div className="rounded-xl bg-(--bg-surface) mb-4">
              <div className="py-4 px-6 flex flex-col md:flex-row justify-between md:items-center">
                <div className="flex gap-2 items-center">
                  <p className="md:text-xl font-bold">Global Manufacturing Ltd.</p>
                  <Badge secondary>
                    Verified
                  </Badge>
                </div>
                <Link href={''} className='text-(--primary) flex items-center gap-2 font-bold'>
                  Contact Supplier
                  <RiMessage2Line />
                </Link>
              </div>
              <Table aria-label='Cart Table' selectable>
                <TableHeader>
                  <TableRow>
                    <TableColumn checkbox rowIds={[]} />
                    <TableColumn>Product</TableColumn>
                    <TableColumn>Specifications</TableColumn>
                    <TableColumn>Price Per Unit</TableColumn>
                    <TableColumn>Quantity</TableColumn>
                    <TableColumn>Total</TableColumn>
                    <TableColumn>MOQ Status</TableColumn>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell checkbox rowId={0} />
                    <TableCell>
                      <div className="flex gap-2">
                        <Image src={image} alt='' width={0} height={0} className='hidden lg:block w-10 aspect-square rounded-lg object-cover' />
                        Heavy Duty Industrial Steel Valves
                      </div>
                    </TableCell>
                    <TableCell>Grade G30, 250PSI</TableCell>
                    <TableCell>$45</TableCell>
                    <TableCell>
                      <input
                        type='number'
                        className='p-2 border border-(--border-default) w-40'
                        defaultValue={100}
                      />
                    </TableCell>
                    <TableCell>$4500</TableCell>
                    <TableCell>
                      <Badge className='inline-flex items-center gap-1' success>
                        <RiCheckboxCircleFill />
                        Met
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell checkbox rowId={0} />
                    <TableCell>
                      <div className="flex gap-2">
                        <Image src={image} alt='' width={0} height={0} className='hidden lg:block w-10 aspect-square rounded-lg object-cover' />
                        Heavy Duty Industrial Steel Valves
                      </div>
                    </TableCell>
                    <TableCell>Grade G30, 250PSI</TableCell>
                    <TableCell>$45</TableCell>
                    <TableCell>
                      <input
                        type='number'
                        className='p-2 border border-(--border-default) w-40'
                        defaultValue={100}
                      />
                    </TableCell>
                    <TableCell>$4500</TableCell>
                    <TableCell>
                      <Badge className='inline-flex items-center gap-1' success>
                        <RiCheckboxCircleFill />
                        Met
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div className="rounded-xl bg-(--bg-surface) mb-4">
              <div className="py-4 px-6 flex flex-col md:flex-row justify-between md:items-center">
                <div className="flex gap-2 items-center">
                  <p className="md:text-xl font-bold">Shenzhen Tech Solutions</p>
                  <Badge>
                    Unverified
                  </Badge>
                </div>
                <Link href={''} className='text-(--primary) flex items-center gap-2 font-bold'>
                  Contact Supplier
                  <RiMessage2Line />
                </Link>
              </div>
              <Table aria-label='Cart Table' selectable>
                <TableHeader>
                  <TableRow>
                    <TableColumn checkbox rowIds={[]} />
                    <TableColumn>Product</TableColumn>
                    <TableColumn>Specifications</TableColumn>
                    <TableColumn>Price Per Unit</TableColumn>
                    <TableColumn>Quantity</TableColumn>
                    <TableColumn>Total</TableColumn>
                    <TableColumn>MOQ Status</TableColumn>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell checkbox rowId={0} />
                    <TableCell>
                      <div className="flex gap-2">
                        <Image src={image} alt='' width={0} height={0} className='hidden lg:block w-10 aspect-square rounded-lg object-cover' />
                        Heavy Duty Industrial Steel Valves
                      </div>
                    </TableCell>
                    <TableCell>Grade G30, 250PSI</TableCell>
                    <TableCell>$45</TableCell>
                    <TableCell>
                      <input 
                        type='number' 
                        className='p-2 border border-(--border-default) w-40' 
                        defaultValue={100}
                      />
                    </TableCell>
                    <TableCell>$4500</TableCell>
                    <TableCell>
                      <Badge className='inline-flex items-center gap-1' success>
                        <RiCheckboxCircleFill />
                        Met
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="w-full lg:basis-1/4 flex flex-col">
            <div className="rounded-xl bg-(--bg-surface) p-6 mb-4">
              <h1 className="text-2xl mb-4">Order Summary</h1>
              <div className="pb-4 border-b border-(--border-muted)">
                <div className="my-2 flex items-center justify-between">
                  <p className="text-sm text-(--primary)/60">Items Subtotal (3)</p>
                  <p className="font-bold">$6,612.50</p>
                </div>
                <div className="my-2 flex items-center justify-between">
                  <p className="text-sm text-(--primary)/60">Bulk Savings</p>
                  <p className="font-bold text-(--success)">-$225.50</p>
                </div>
                <div className="my-2 flex items-center justify-between">
                  <p className="text-sm text-(--primary)/60">Items Subtotal (3)</p>
                  <p className="font-bold">-$6,612.50</p>
                </div>
                <div className="my-2 flex items-center justify-between">
                  <p className="text-sm text-(--primary)/60">Items Subtotal (3)</p>
                  <p className="font-bold">$6,612.50</p>
                </div>
              </div>
              <div className="my-4 flex justify-between">
                <p className="font-bold">Total Payable</p>
                <div className='text-end'>
                  <p className="text-2xl font-bold text-(--primary)">$7,250.50</p>
                  <p className='text-xs text-(--primary)/70 uppercase'>Taxes and Shipping calculated at checkout</p>
                </div>   
              </div>
              <Button primary className='flex gap-2 items-center mb-4 mx-auto'>
                Proceed To Checkout
                <RiArrowRightLine />
              </Button>
              <div className="mb-2">
                <div className="flex gap-2 items-start mb-2">
                  <RiShieldCheckFill className='text-(--success)' />
                  <p className="text-xs text-(--primary)/60">Trade Assurance protects your orders.</p>
                </div>
                <div className="flex gap-2 items-start">
                  <RiCurrencyFill className='text-(--primary)' />
                  <p className="text-xs text-(--primary)/60">Multiple payment methods supported</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl bg-(--primary-soft) border border-(--primary) p-6 flex gap-4 items-start">
              <BsGraphDownArrow size={16} className='text-(--primary) block w-10' />
              <div>
                <p className="font-bold text-sm mb-2">Bulk Savings Tip</p>
                <p className='text-(--primary) text-sm'>Add 25% more "Precision Brass Pipe Fittings" to save an additional 3% ($9.37) on this item.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Cart
