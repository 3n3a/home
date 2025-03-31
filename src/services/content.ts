import { RecordFullListOptions, RecordListOptions } from "pocketbase";
import { Gallery } from "../model/Gallery";
import { Link } from "../model/Links";
import { Project } from "../model/Project";
import { getPocketbaseInstance } from "./instance";
import { Author } from "../model/Author";
import { TextRecord } from "../model/TextRecord";
import { HtmlRecord } from "../model/HtmlRecord";
const { ENVIRONMENT } = import.meta.env;

let cachedTexts: TextRecord[] = [];

export async function getText(name: string): Promise<string> {
    if (cachedTexts.length === 0 || ENVIRONMENT === "development") {
        cachedTexts = await getTexts();
    }
    const findResult: TextRecord|undefined = cachedTexts.find(p => p.name === name);
    return findResult?.text || '';
}

export async function getTexts(options?: RecordFullListOptions): Promise<TextRecord[]> {
    const defaultOptions: RecordFullListOptions = {
        filter: 'type = "text"'
    };
    const pb = getPocketbaseInstance();
    return await pb.collection('website_texts').getFullList({...defaultOptions, ...options})
}

export async function getHtml(name: string, options?: RecordListOptions): Promise<string> {
    const filter = `name = "${name}" && type = "html"`;
    const defaultOptions: RecordListOptions = {};
    const pb = getPocketbaseInstance();
    const record = await pb.collection('website_texts').getFirstListItem<HtmlRecord>(filter, {...defaultOptions, ...options});
    return record.html;
}

export async function getProjectsByAuthor(author: Author): Promise<Project[]> {
    return getProjects({
        filter: `status = "live" && author = "${author}"`,
    })
}

export async function getProjects(options?: RecordFullListOptions): Promise<Project[]> {
    const defaultOptions: RecordFullListOptions = {
        sort: 'title'
    };
    const pb = getPocketbaseInstance();
    return await pb.collection('projects').getFullList({ ...defaultOptions, ...options });
}

export async function getGalleries(options?: RecordFullListOptions): Promise<Gallery[]> {
    const defaultOptions: RecordFullListOptions = {};
    const pb = getPocketbaseInstance();
    return await pb.collection('gallery_display').getFullList({ ...defaultOptions, ...options });
}

export async function getLinks(options?: RecordFullListOptions): Promise<Link[]> {
    const defaultOptions: RecordFullListOptions = {
        expand: 'tags',
        fields: '*,expand.tags',
        sort: '-created'
    };
    const pb = getPocketbaseInstance();
    return await pb.collection('links').getFullList<Link>({ ...defaultOptions, ...options });
}