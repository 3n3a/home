import { Picture } from "./Picture"

export interface Gallery {
    collectionId: string
    collectionName: string
    description: string
    id: string
    pictures: Picture[]
    title: string
}