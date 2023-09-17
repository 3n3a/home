export interface LinkTag {
    name: string
}

export interface LinkTagExpand {
    tags: LinkTag[]
}

export interface Link {
    id: string
    title: string
    notes: string
    status: string
    url: string
    expand: LinkTagExpand
}