import { Modal, App, Setting } from "obsidian";

export class LastNDaysModal extends Modal {
  onSubmit: (nDays: number) => void;
  
  constructor(app: App, onSubmit: (nDays: number) => void) {
    super(app);
    this.onSubmit = onSubmit;
  }
  
  onOpen() {
    let nDays = 7;
    const { contentEl } = this;
    contentEl.createEl("h2", { text: "Import tasks from last N days" });
    new Setting(contentEl)
      .setName("Last N days")
      .addText((text) =>
        text
          .setPlaceholder("7")
          .setValue("7")
          .onChange((value) => {
            nDays = parseInt(value) || 7;
          })
      );
    new Setting(contentEl)
      .addButton((btn) =>
        btn
          .setButtonText("Import")
          .setCta()
          .onClick(() => {
            this.close();
            this.onSubmit(nDays);
          })
      );
  }
  
  onClose() {
    this.contentEl.empty();
  }
} 