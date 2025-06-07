# Confluence Tasks Sync

A powerful Obsidian plugin that seamlessly syncs your Confluence tasks with Obsidian, enabling you to manage your work tasks directly within your notes.

## ✨ Features

- **🔄 Bidirectional Sync**: Import tasks from Confluence and sync completion status back
- **📅 Smart Scheduling**: Automatic daily sync at configurable times
- **📊 Week-based Organization**: Tasks grouped by creation week for better organization
- **🔗 Rich Task Details**: Includes due dates, page links, and task descriptions
- **🚫 Duplicate Prevention**: Intelligent detection to avoid importing the same task twice
- **⚙️ Flexible Configuration**: Customizable sync intervals, time windows, and credentials

## 🚀 Installation

### From Obsidian Community Plugins

1. Open Obsidian Settings
2. Go to **Community Plugins** and disable **Safe Mode**
3. Click **Browse** and search for "Confluence Tasks Sync"
4. Install and enable the plugin

### Manual Installation

1. Download the latest release from [GitHub Releases](https://github.com/adarsh1990/obsidian-connie-task-plugin/releases)
2. Extract the files to your vault's `.obsidian/plugins/confluence-tasks-sync/` folder
3. Enable the plugin in Obsidian settings

## ⚙️ Configuration

### 1. API Credentials

Navigate to **Settings → Confluence Tasks Sync** and configure:

- **Email**: Your Atlassian account email
- **API Token**: Generate from [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)

### 2. Sync Settings

- **Enable auto-sync**: Toggle daily automatic synchronization
- **Sync time**: Set hour and minute for daily sync (24-hour format)
- **Default days to fetch**: Number of days to look back for tasks (1-30)
- **Auto-sync completed tasks**: Automatically mark completed tasks in Confluence

## 📖 Usage

### Manual Import

1. Use **Ctrl/Cmd + P** to open the command palette
2. Run **"Import Confluence Tasks"**
3. Specify the number of days to fetch tasks from
4. Tasks are imported to `Confluence Tasks.md`

### Task Format

Tasks are imported with rich formatting:
```markdown
### Week of January 6 - January 12, 2025

- [ ] Review the API documentation 📅 2025-01-10 [Project Documentation](https://your-site.atlassian.net/wiki/page-link) <!-- task-id: 12345 -->
- [ ] Update user interface mockups 📅 2025-01-12 [Design System](https://your-site.atlassian.net/wiki/page-link) <!-- task-id: 12346 -->
```

### Completing Tasks

1. Mark tasks complete in Obsidian: `- [x]`
2. Run **"Sync Completed Tasks to Confluence"** or wait for auto-sync
3. Tasks are automatically marked complete in Confluence

## 🔧 Advanced Configuration

### Custom Time Ranges

- Use the manual import to fetch tasks from specific time periods
- Auto-sync uses the "Default days to fetch" setting
- Maximum lookback period: 30 days

### Workspace Organization

- All tasks are stored in `Confluence Tasks.md`
- Tasks are organized by week of creation
- Most recent weeks appear first
- Hidden task IDs prevent duplicates

## 🛠️ Development

### Prerequisites

- Node.js 16+
- npm or yarn

### Building

```bash
npm install
npm run build
```

### Development

```bash
npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/adarsh1990/obsidian-connie-task-plugin/issues)
- **Discussions**: [GitHub Discussions](https://github.com/adarsh1990/obsidian-connie-task-plugin/discussions)

## 🏷️ Version History

### v1.0.0
- ✨ Initial release
- 🔄 Bidirectional task sync with Confluence
- 📅 Automatic daily sync scheduling
- 📊 Week-based task organization
- ⚙️ Comprehensive settings panel
- 🚫 Duplicate detection and prevention

---

Made with ❤️ for the Obsidian and Atlassian communities 