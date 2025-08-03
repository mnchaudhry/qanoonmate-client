import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
    size?: 'lg' | 'md' | 'sm'
    type?: 'green' | 'mini_green' | 'white' | 'mini_white'
    containerClassName?: string
    className?: string
    href?: string
}

const SIZE_MAP = {
    lg: 'text-4xl py-2 px-4',
    md: 'text-2xl py-1.5 px-3',
    sm: 'text-lg py-1 px-2'
}

const COLOR_MAP = {
    green: 'text-primary',
    mini_green: 'text-primary',
    white: 'text-white',
    mini_white: 'text-white'
}

const Logo: React.FC<LogoProps> = ({
    size = 'md',
    type = 'green',
    containerClassName,
    className,
    href
}) => {
    // Variables
    const sizeClass = SIZE_MAP[size]
    const colorClass = COLOR_MAP[type]

    // Render
    return (
        <Link href={href || "/"} style={{ fontFamily: 'fantasy' }} className={cn('inline-block', containerClassName)}>
            {type === 'mini_green' || type === 'mini_white' ? (
                <span
                    className={cn(
                        'font-extrabold rounded-lg tracking-tight flex items-center justify-center select-none transition-colors',
                        sizeClass,
                        colorClass,
                        className
                    )}
                    style={{
                        letterSpacing: '0.05em',
                        minWidth: size === 'sm' ? 32 : size === 'lg' ? 56 : 40,
                        minHeight: size === 'sm' ? 32 : size === 'lg' ? 56 : 40,
                        fontSize: size === 'sm' ? '1.25rem' : size === 'lg' ? '2.25rem' : '1.5rem',
                    }}
                >
                    <span className="font-black text-primary" style={{ fontSize: 'inherit' }}>V</span>
                </span>
            ) : (
                <span
                    className={cn(
                        'relative top-1 font-extrabold rounded-lg tracking-tight flex items-center justify-center select-none transition-colors',
                        sizeClass,
                        colorClass,
                        className
                    )}
                    style={{
                        letterSpacing: '0.05em',
                        minWidth: size === 'sm' ? 80 : size === 'lg' ? 180 : 120,
                        minHeight: size === 'sm' ? 28 : size === 'lg' ? 48 : 36,
                    }}
                >
                    <div className="font-bold text-lg md:text-xl lg:text-[30px] whitespace-nowrap ">Verdict AI</div>
                </span>
            )}
        </Link>
    )
}

export default Logo;
