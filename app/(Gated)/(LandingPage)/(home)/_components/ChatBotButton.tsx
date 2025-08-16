"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { BotGreen } from "@/constants/images"

const ChatBotButton = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-neutral p-4 bg-secondary rounded-full shadow-md transition-all duration-300"
                >
                    <Image src={BotGreen} alt="Bot Image" width={30} height={30} />
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.25 }}
                        className="fixed bottom-24 right-6 w-72 bg-neutral dark:bg-gray-900 border dark:border-gray-700 shadow-lg rounded-xl p-4 z-50"
                    >
                        <p className="text-sm text-muted-foreground dark:text-gray-300 mb-1 font-semibold">QanoonMate Bot 🤖</p>
                        <p className="text-sm text-muted-foreground dark:text-gray-400">How can I assist you today?</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default ChatBotButton
