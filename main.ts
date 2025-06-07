import { Plugin, Notice } from "obsidian";
import { ConnieTasksSettings, DEFAULT_SETTINGS, ConnieTasksSettingTab } from "./settings";
import { fetchConfluenceTasks, fetchPageTitlesAndLinks, updateTaskStatus } from "./confluenceApi";
import { groupTasksByWeek } from "./taskProcessor";
import { getExistingTaskIds, getCompletedTaskIds, writeTasksToNote } from "./fileManager";
import { LastNDaysModal } from "./modal";

export default class ConnieTasksPlugin extends Plugin {
  settings!: ConnieTasksSettings;
  syncInterval!: number;

  async onload() {
    await this.loadSettings();

    // Add setting tab
    this.addSettingTab(new ConnieTasksSettingTab(this.app, this));

    this.addCommand({
      id: "import-confluence-tasks",
      name: "Import Confluence Tasks",
      callback: async () => {
        // Prompt for last N days
        new LastNDaysModal(this.app, async (nDays: number) => {
          await this.importTasks(nDays);
        }).open();
      },
    });

    this.addCommand({
      id: "sync-completed-tasks",
      name: "Sync Completed Tasks to Confluence",
      callback: async () => {
        await this.syncCompletedTasks();
      },
    });

    // Start auto-sync if enabled
    if (this.settings.autoSyncEnabled) {
      this.startAutoSync();
    }
  }

  async onunload() {
    if (this.syncInterval) {
      window.clearInterval(this.syncInterval);
    }
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
    
    // Restart auto-sync if settings changed
    if (this.syncInterval) {
      window.clearInterval(this.syncInterval);
    }
    if (this.settings.autoSyncEnabled) {
      this.startAutoSync();
    }
  }

  startAutoSync() {
    const now = new Date();
    const syncTime = new Date();
    syncTime.setHours(this.settings.syncTimeHour, this.settings.syncTimeMinute, 0, 0);
    
    // If sync time has passed today, schedule for tomorrow
    if (syncTime <= now) {
      syncTime.setDate(syncTime.getDate() + 1);
    }
    
    const msUntilSync = syncTime.getTime() - now.getTime();
    
    setTimeout(() => {
      this.performDailySync();
      // Set up daily interval (24 hours)
      this.syncInterval = window.setInterval(() => {
        this.performDailySync();
      }, 24 * 60 * 60 * 1000);
    }, msUntilSync);
  }

  async performDailySync() {
    try {
      await this.importTasks(this.settings.defaultDays);
      
      if (this.settings.autoSyncCompleted) {
        await this.syncCompletedTasks();
      }
      
      new Notice("Daily Confluence sync completed.");
    } catch (e) {
      console.error("Daily sync failed:", e);
      new Notice("Daily Confluence sync failed. Check console for details.");
    }
  }

  async importTasks(nDays: number) {
    try {
      const tasks = await fetchConfluenceTasks(nDays, this.settings);
      if (!tasks.length) {
        new Notice("No tasks found from Confluence.");
        return;
      }
      // Hydrate page titles and links
      const pageIdSet = new Set<string>();
      for (const task of tasks) {
        if (task.pageId) pageIdSet.add(task.pageId);
      }
      const pageIdToMeta = await fetchPageTitlesAndLinks(Array.from(pageIdSet), this.settings);
      
      // Get existing task IDs to avoid duplicates
      const existingTaskIds = await getExistingTaskIds(this);
      const newTasks = tasks.filter(task => task.id && !existingTaskIds.has(task.id));
      
      if (!newTasks.length) {
        new Notice("No new tasks to import.");
        return;
      }
      
      const obsidianTasks = groupTasksByWeek(newTasks, pageIdToMeta);
      await writeTasksToNote(this, obsidianTasks);
      new Notice(`Imported ${newTasks.length} new Confluence tasks to 'Confluence Tasks.md'.`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      new Notice("Failed to import Confluence tasks: " + msg);
    }
  }

  async syncCompletedTasks() {
    try {
      const completedTaskIds = await getCompletedTaskIds(this);
      if (!completedTaskIds.length) {
        new Notice("No completed tasks to sync.");
        return;
      }
      
      let successCount = 0;
      let errorCount = 0;
      
      for (const taskId of completedTaskIds) {
        try {
          await updateTaskStatus(taskId, "complete", this.settings);
          successCount++;
        } catch (e) {
          console.error(`Failed to update task ${taskId}:`, e);
          errorCount++;
        }
      }
      
      if (successCount > 0) {
        new Notice(`Successfully marked ${successCount} tasks as complete in Confluence.`);
      }
      if (errorCount > 0) {
        new Notice(`Failed to update ${errorCount} tasks. Check console for details.`);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      new Notice("Failed to sync completed tasks: " + msg);
    }
  }
}

