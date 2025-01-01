function ShadCnSkeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={(`animate-pulse bg-muted ${className}`)}
            {...props}
        />
    )
}

export { ShadCnSkeleton }