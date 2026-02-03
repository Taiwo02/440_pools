import Dropdown from '../ui/dropdown'
import Button from '../ui/button'

import { RiSearchLine} from 'react-icons/ri'

const SearchForm = ({category, setCategory, productCategories, searchTerm, setSearchTerm}:any) => (
    <form
    className="
      flex items-stretch w-full min-w-0
      border-2 border-(--primary)
      rounded-full
      overflow-hidden
    "
  >
    {/* Category dropdown – hidden on mobile */}
    <div className="hidden lg:block">
      <Dropdown
        value={category}
        onChange={value => setCategory(value)}
        options={productCategories}
        className="p-3! rounded-l-full!"
        dropClass="w-50!"
      />
    </div>

    {/* Search input */}
    <input
      className="
        flex-1
        p-3
        bg-(--bg-surface)
        border-none
        focus:outline-none
        placeholder:text-(--muted)
        text-sm lg:text-base
      "
      name="searchTerm"
      value={searchTerm}
      placeholder="Search products or suppliers"
      onChange={e => setSearchTerm(e.target.value)}
    />

    {/* Search button – compact on mobile */}
    <Button
      primary
      className="
        flex items-center justify-center
        px-3 lg:px-5
        text-xs lg:text-sm
        rounded-none lg:rounded-r-full!
      "
    >
      <RiSearchLine className="text-lg lg:text-base" />
      <span className="hidden lg:inline">Search</span>
    </Button>
  </form>
  );
export default SearchForm
  