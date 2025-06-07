import { requestUrl } from "obsidian";
import type { ConnieTasksSettings } from "./settings";

export async function fetchConfluenceTasks(lastNDays: number, settings: ConnieTasksSettings): Promise<any[]> {
  const email = settings.email;
  const apiToken = settings.apiToken;
  const domain = settings.atlassianDomain;
  
  if (!email || !apiToken || !domain) {
    throw new Error("Please configure your Confluence domain, email, and API token in the plugin settings.");
  }
  // Calculate created-at-from in ms
  const now = Date.now();
  const from = now - lastNDays * 24 * 60 * 60 * 1000;
  const apiUrl =
    `https://${domain}/wiki/api/v2/tasks?assigned-to=5d40e184813f380dab351206&status=incomplete&body-format=atlas_doc_format&include-blank-tasks=false&created-at-from=${from}`;
  const auth = btoa(`${email}:${apiToken}`);

  const response = await requestUrl({
    url: apiUrl,
    method: "GET",
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: "application/json",
    },
  });
  const data = response.json;
  return data.results || [];
}

export async function fetchPageTitlesAndLinks(pageIds: string[], settings: ConnieTasksSettings): Promise<Record<string, { title: string, webui: string }>> {
  if (!pageIds.length) return {};
  const email = settings.email;
  const apiToken = settings.apiToken;
  const domain = settings.atlassianDomain;
  
  if (!email || !apiToken || !domain) {
    throw new Error("Please configure your Confluence domain, email, and API token in the plugin settings.");
  }
  const idsParam = pageIds.join(",");
  const apiUrl = `https://${domain}/wiki/api/v2/pages?id=${idsParam}`;
  const auth = btoa(`${email}:${apiToken}`);

  const response = await requestUrl({
    url: apiUrl,
    method: "GET",
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: "application/json",
    },
  });
  const data = response.json;
  const mapping: Record<string, { title: string, webui: string }> = {};
  if (data.results && Array.isArray(data.results)) {
    for (const page of data.results) {
      if (page.id && page.title && page._links?.webui) {
        mapping[page.id] = { title: page.title, webui: page._links.webui };
      }
    }
  }
  return mapping;
}

export async function updateTaskStatus(taskId: string, status: "complete" | "incomplete", settings: ConnieTasksSettings): Promise<void> {
  const email = settings.email;
  const apiToken = settings.apiToken;
  const domain = settings.atlassianDomain;
  
  if (!email || !apiToken || !domain) {
    throw new Error("Please configure your Confluence domain, email, and API token in the plugin settings.");
  }
  const apiUrl = `https://${domain}/wiki/api/v2/tasks/${taskId}`;
  const auth = btoa(`${email}:${apiToken}`);

  const requestBody = {
    status: status
  };

  const response = await requestUrl({
    url: apiUrl,
    method: "PUT",
    headers: {
      Authorization: `Basic ${auth}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (response.status < 200 || response.status >= 300) {
    throw new Error(`Failed to update task ${taskId}: ${response.status}`);
  }
} 