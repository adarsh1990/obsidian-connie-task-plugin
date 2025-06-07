import { App, PluginSettingTab, Setting } from "obsidian";
import type ConnieTasksPlugin from "./main";

export interface ConnieTasksSettings {
  autoSyncEnabled: boolean;
  syncTimeHour: number; // 0-23
  defaultDays: number;
  autoSyncCompleted: boolean;
  email: string;
  apiToken: string;
  atlassianDomain: string;
  tasksFileName: string;
}

export const DEFAULT_SETTINGS: ConnieTasksSettings = {
  autoSyncEnabled: false,
  syncTimeHour: 9,
  defaultDays: 7,
  autoSyncCompleted: false,
  email: "",
  apiToken: "",
  atlassianDomain: "",
  tasksFileName: "Confluence Tasks",
};

export class ConnieTasksSettingTab extends PluginSettingTab {
  plugin: ConnieTasksPlugin;

  constructor(app: App, plugin: ConnieTasksPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h2', { text: 'Connie Tasks Plugin Settings' });

    // File settings
    containerEl.createEl('h3', { text: 'File Settings' });

    new Setting(containerEl)
      .setName('Tasks file name')
      .setDesc('Name of the file where tasks will be stored (without .md extension)')
      .addText(text => text
        .setPlaceholder('Confluence Tasks')
        .setValue(this.plugin.settings.tasksFileName)
        .onChange(async (value) => {
          this.plugin.settings.tasksFileName = value || 'Confluence Tasks';
          await this.plugin.saveSettings();
        }));

    // Auto-sync settings
    containerEl.createEl('h3', { text: 'Sync Settings' });
    new Setting(containerEl)
      .setName('Enable auto-sync')
      .setDesc('Automatically import tasks daily')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.autoSyncEnabled)
        .onChange(async (value) => {
          this.plugin.settings.autoSyncEnabled = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('Sync time')
      .setDesc('Hour of the day to run auto-sync (0-23, runs at the top of the hour)')
      .addSlider(slider => slider
        .setLimits(0, 23, 1)
        .setValue(this.plugin.settings.syncTimeHour)
        .setDynamicTooltip()
        .onChange(async (value) => {
          this.plugin.settings.syncTimeHour = value;
          await this.plugin.saveSettings();
        }));



    new Setting(containerEl)
      .setName('Default days to fetch')
      .setDesc('Number of days to fetch tasks from (default for auto-sync)')
      .addSlider(slider => slider
        .setLimits(1, 30, 1)
        .setValue(this.plugin.settings.defaultDays)
        .setDynamicTooltip()
        .onChange(async (value) => {
          this.plugin.settings.defaultDays = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('Auto-sync completed tasks')
      .setDesc('Automatically sync completed tasks to Confluence during daily sync')
      .addToggle(toggle => toggle
        .setValue(this.plugin.settings.autoSyncCompleted)
        .onChange(async (value) => {
          this.plugin.settings.autoSyncCompleted = value;
          await this.plugin.saveSettings();
        }));

    // API credentials
    containerEl.createEl('h3', { text: 'Confluence API Credentials' });

    new Setting(containerEl)
      .setName('Atlassian Domain')
      .setDesc('Your Atlassian domain (e.g., company.atlassian.net)')
      .addText(text => text
        .setPlaceholder('company.atlassian.net')
        .setValue(this.plugin.settings.atlassianDomain)
        .onChange(async (value) => {
          this.plugin.settings.atlassianDomain = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('Email')
      .setDesc('Your Atlassian email address')
      .addText(text => text
        .setPlaceholder('user@example.com')
        .setValue(this.plugin.settings.email)
        .onChange(async (value) => {
          this.plugin.settings.email = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('API Token')
      .setDesc('Your Atlassian API token (from id.atlassian.com)')
      .addText(text => text
        .setPlaceholder('API token')
        .setValue(this.plugin.settings.apiToken)
        .onChange(async (value) => {
          this.plugin.settings.apiToken = value;
          await this.plugin.saveSettings();
        }));
  }
} 