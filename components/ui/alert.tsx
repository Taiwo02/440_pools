import { cn } from './utils'

type AlertProps = {
  children: React.ReactNode,
  type: 'error' | 'success',
  className?: string
}

const Alert = ({ children, className = '', type }: AlertProps) => {
  return (
    <div className={cn(`w-full py-4 px-8 text-center uppercase border-2 rounded-xl ${type == 'error' ? 'border-red-400 bg-red-100 text-red-500' : 'border-green-600 bg-green-100 text-green-700'} font-semibold`, className)}>
      {children}
    </div>
  )
}

export default Alert