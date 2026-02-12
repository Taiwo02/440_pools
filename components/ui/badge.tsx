import { cn } from './utils'

type Props = {
  variant: "primary" | "secondary" | "warning" | "success" | "danger";
  children: string | React.ReactNode;
  className?: string;
}

const Badge = ({ variant, children ,className }: Props) => {
  if(variant === "primary") {
    return (
      <span className={cn("text-xs py-1 p-2 rounded-full bg-(--primary)/30 text-(--primary)", className)}>{children}</span>
    )
  }

  if(variant === "secondary") {
    return (
      <span className={cn("text-xs py-1 p-2 rounded-full bg-(--secondary)/30 text-(--secondary)", className)}>{children}</span>
    )
  }    
 
  if(variant === "warning") {
    return (
      <span className={cn("text-xs py-1 p-2 rounded-full bg-amber-200 text-amber-700", className)}>{children}</span>
    )
  }

  if(variant === "success") {
    return (
      <span className={cn("text-xs py-1 p-2 rounded-full bg-green-200 text-green-700", className)}>{children}</span>
    )
  } 

  if(variant === "danger") {
    return (
      <span className={cn("text-xs py-1 p-2 rounded-full bg-red-200 text-red-700", className)}>{children}</span>
    )
  }
  return (
    <span className={cn("text-xs py-1 p-2 rounded-full bg-slate-200 text-black", className)}>{children}</span>
  )
}

export default Badge