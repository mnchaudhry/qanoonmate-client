"use client"

import React, { ReactNode } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Props {
    title: string,
    description: string,
    children: ReactNode,
    open: boolean,
    onClose: () => void,
    showCloseButton?: boolean
}

export const Modal = ({ title, description, children, open, onClose, showCloseButton = true }: Props) => {


    return (
        <Dialog open={open} onOpenChange={showCloseButton ? onClose : () => { }} >
            <DialogContent>
                {
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>
                }
                {

                    <DialogDescription>{description}</DialogDescription>
                }
                {children}
            </DialogContent>
        </Dialog>
    )
}