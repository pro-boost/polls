import * as React from "react"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const cardClasses = className ? `card ${className}` : "card"
  return (
    <div
      ref={ref}
      className={cardClasses}
      {...props}
    />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const headerClasses = className ? `card-header ${className}` : "card-header"
  return (
    <div
      ref={ref}
      className={headerClasses}
      {...props}
    />
  )
})
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  const titleClasses = className ? `card-title ${className}` : "card-title"
  return (
    <h3
      ref={ref}
      className={titleClasses}
      {...props}
    />
  )
})
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const descClasses = className ? `card-description ${className}` : "card-description"
  return (
    <p
      ref={ref}
      className={descClasses}
      {...props}
    />
  )
})
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const contentClasses = className ? `card-content ${className}` : "card-content"
  return (
    <div 
      ref={ref} 
      className={contentClasses} 
      {...props} 
    />
  )
})
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const footerClasses = className ? `card-footer ${className}` : "card-footer"
  return (
    <div
      ref={ref}
      className={footerClasses}
      {...props}
    />
  )
})
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
