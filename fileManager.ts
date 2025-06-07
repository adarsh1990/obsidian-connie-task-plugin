import { Plugin, TFile } from "obsidian";

export async function getExistingTaskIds(plugin: Plugin): Promise<Set<string>> {
  const fileName = "Confluence Tasks.md";
  const existingIds = new Set<string>();
  
  try {
    const file = plugin.app.vault.getAbstractFileByPath(fileName) as TFile;
    if (file) {
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

export async function getCompletedTaskIds(plugin: Plugin): Promise<string[]> {
  const fileName = "Confluence Tasks.md";
  const completedTaskIds: string[] = [];
  
  try {
    const file = plugin.app.vault.getAbstractFileByPath(fileName) as TFile;
    if (file) {
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

export async function writeTasksToNote(plugin: Plugin, tasks: string): Promise<void> {
  const fileName = "Confluence Tasks.md";
  let file: TFile | null = null;
  try {
    file = plugin.app.vault.getAbstractFileByPath(fileName) as TFile;
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