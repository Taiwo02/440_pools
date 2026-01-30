import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import Button from "./button";

type PaginationProps = {
  currentPage: number; 
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>; 
  totalPages: number; 
  prevDisable: any; 
  nextDisable: any; 
  prev: () => void; 
  next: () => void;
}

const Pagination = ({ currentPage, setCurrentPage, totalPages, prevDisable, nextDisable, prev, next }: PaginationProps) => {
  return (
    <div className="flex justify-self-end">
      <div className='flex gap-3 p-2 bg-(--elevated) rounded-xl w-fit justify-between items-center mx-auto'>
        <Button
          primary
          className={`px-3! bg-(--primary) rounded-xl text-white ${currentPage === 1 ? 'opacity-50 cursor-not-allowed!' : 'cursor-pointer'}`}
          onClick={prev}
          disabled={prevDisable}
        >
          <RiArrowLeftSLine />
        </Button>
        <span className="text-lg font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          primary
          className={`px-3! bg-(--primary) rounded-xl text-white cursor-pointer ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed!' : 'cursor-pointer'}`}
          onClick={next}
          disabled={nextDisable}
        >
          <RiArrowRightSLine />
        </Button>
      </div>
    </div>
  )
}

export default Pagination
