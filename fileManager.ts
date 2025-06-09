import { Plugin, TFile } from "obsidian";
import { ConnieTasksSettings } from "./settings";

export async function getExistingTaskIds(plugin: Plugin, settings: ConnieTasksSettings): Promise<Set<string>> {
  const fileName = `${settings.tasksFileName}.md`;
  const existingIds = new Set<string>();
  
  try {
    const file = plugin.app.vault.getAbstractFileByPath(fileName);
    if (file instanceof TFile) {
      const content = await plugin.app.vault.read(file);
      // Extract task IDs from comments using regex
      const taskIdRegex = /<!-- task-id: (\d+) -->/g;
      let match;
      while ((match = taskIdRegex.exec(content)) !== null) {
        existingIds.add(match[1]);
      }
    }
  } catch {
    // File doesn't exist yet, no existing IDs
  }
  
  return existingIds;
}

export async function getCompletedTaskIds(plugin: Plugin, settings: ConnieTasksSettings): Promise<string[]> {
  const fileName = `${settings.tasksFileName}.md`;
  const completedTaskIds: string[] = [];
  
  try {
    const file = plugin.app.vault.getAbstractFileByPath(fileName);
    if (file instanceof TFile) {
      const content = await plugin.app.vault.read(file);
      // Find completed tasks (marked with [x]) and extract their task IDs
      const lines = content.split('\n');
      for (const line of lines) {
        if (line.trim().startsWith('- [x]')) {
          // Extract task ID from the comment
          const taskIdMatch = line.match(/<!-- task-id: (\d+) -->/);
          if (taskIdMatch) {
            completedTaskIds.push(taskIdMatch[1]);
          }
        }
      }
    }
  } catch {
    // File doesn't exist or error reading
  }
  
  return completedTaskIds;
}

export async function writeTasksToNote(plugin: Plugin, tasks: string, settings: ConnieTasksSettings): Promise<void> {
  const fileName = `${settings.tasksFileName}.md`;
  let file: TFile | null = null;
  
  try {
    const abstractFile = plugin.app.vault.getAbstractFileByPath(fileName);
    if (abstractFile instanceof TFile) {
      file = abstractFile;
    }
  } catch {}
  
  if (file) {
    // Append to existing file
    const existing = await plugin.app.vault.read(file);
    await plugin.app.vault.modify(file, existing + "\n" + tasks);
  } else {
    // Create new file
    await plugin.app.vault.create(fileName, tasks);
  }
} 