import { motion } from "framer-motion";

export function FloatingIcon({ Icon, delay, x, y }: { Icon: any; delay: number; x: number; y: number }) {
    return (
        <motion.div
            className="fixed text-primary/30 z-[-1]"
            style={{ left: `${x}%`, top: `${y}%` }}
            animate={{
                y: [0, -10, 0],
                x: [0, 5, 0],
                rotate: [0, 5, -5, 0],
            }}
            transition={{
                repeat: Infinity,
                duration: 6,
                ease: "easeInOut",
                delay,
            }}
        >
            <Icon size={36} />
        </motion.div>
    );
}
