
export interface Review {
    _id: string
    reviewer: string // userId
    reviewee: string // userId
    rating: number
    comment?: string
    verifiedInteraction: boolean
    context: 'consultation' | 'chat' | 'document' | 'other'
    createdAt: string
    updatedAt: string
}
