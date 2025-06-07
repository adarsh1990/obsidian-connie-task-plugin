import { App, PluginSettingTab, Setting } from "obsidian";
import type ConnieTasksPlugin from "./main";

export interface ConnieTasksSettings {
  autoSyncEnabled: boolean;
  syncTimeHour: number; // 0-23
  syncTimeMinute: number; // 0-59
  defaultDays: number;
  autoSyncCompleted: boolean;
  email: string;
  apiToken: string;
}

export const DEFAULT_SETTINGS: ConnieTasksSettings = {
  autoSyncEnabled: false,
  syncTimeHour: 9,
  syncTimeMinute: 0,
  defaultDays: 7,
  autoSyncCompleted: false,
  email: "",
  apiToken: "",
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

    // Auto-sync settings
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
      .setName('Sync time (hour)')
      .setDesc('Hour of the day to run auto-sync (0-23)')
      .addSlider(slider => slider
        .setLimits(0, 23, 1)
        .setValue(this.plugin.settings.syncTimeHour)
        .setDynamicTooltip()
        .onChange(async (value) => {
          this.plugin.settings.syncTimeHour = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('Sync time (minute)')
      .setDesc('Minute of the hour to run auto-sync (0-59)')
      .addSlider(slider => slider
        .setLimits(0, 59, 1)
        .setValue(this.plugin.settings.syncTimeMinute)
        .setDynamicTooltip()
        .onChange(async (value) => {
          this.plugin.settings.syncTimeMinute = value;
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