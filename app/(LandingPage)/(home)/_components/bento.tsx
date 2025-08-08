import { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";

const BentoGrid = ({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) => {
    return (
        <div
            className={cn("grid w-full auto-rows-[28rem] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className,)}
        >
            {children}
        </div>
    );
};

const BentoCard = ({
    name,
    className,
    background,
    Icon,
    description,
    href,
    cta,
}: {
    name: string;
    className: string;
    background: ReactNode;
    Icon: any;
    description: string;
    href: string;
    cta: string;
}) => (
    <div
        key={name}
        className={cn(
            "group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-2xl",
            // light styles
            "bg-neutral border border-border [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
            // dark styles
            "transform-gpu dark:bg-neutral dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
            "hover:border-primary/20 hover:shadow-xl transition-all duration-300",
            className,
        )}
    >
        <div>{background}</div>
        <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-3 p-8 transition-all duration-300 group-hover:-translate-y-12">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                <Icon className="h-7 w-7 origin-left transform-gpu text-primary transition-all duration-300 ease-in-out group-hover:scale-90" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                {name}
            </h3>
            <p className="max-w-lg text-muted-foreground text-lg leading-relaxed">{description}</p>
        </div>

        <div
            className={cn(
                "pointer-events-none absolute bottom-0 flex w-full translate-y-12 transform-gpu flex-row items-center p-6 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
            )}
        >
            <Button variant="ghost" asChild size="lg" className="pointer-events-auto text-primary hover:text-primary-dark">
                <a href={href}>
                    {cta}
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                </a>
            </Button>
        </div>
        <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-primary/5 group-hover:dark:bg-primary/10" />
    </div>
);

export { BentoCard, BentoGrid };
