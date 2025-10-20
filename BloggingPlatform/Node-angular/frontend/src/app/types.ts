export type post = {
    id: number
    title: string
    content: string
    tags: Array<string>
    reactions: any
    views: number
    userId: number
    category: string
}

export type newPost = {
    title: string
    content: string
    tags: Array<string>
    category: string
}