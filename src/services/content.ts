import { Gallery } from "../model/Gallery";
import { Project } from "../model/Project";
import { getToken } from "./auth";

const { API_URL } = import.meta.env;

export async function getProjects(): Promise<Project[]> {
    const token = await getToken();

    const response = await fetch(`${API_URL}/api/collections/projects/records`, {
        redirect: "follow",
        headers: {
            'Authorization': 'Bearer ' + token,
        }
    });
    const data = await response.json();

    if (data && data.items) return data.items;

    return []
}

export async function getGalleries(): Promise<Gallery[]> {
    const token = await getToken();

	const response = await fetch(`${API_URL}/api/collections/gallery_display/records?perPage=1000`, {
		redirect: 'follow',
		headers: {
            'Authorization': 'Bearer ' + token,
        }
	})
	const data = await response.json()
    
    if (data && data.items) return data.items;

    return []
}