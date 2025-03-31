import { Author } from "./Author";

export interface Project {
    title: string;
	body?: string;
	status: string;
	href: string;
	color?: string;
	customBg?: string;
	author: Author;
	created: string;
	updated: string;
}