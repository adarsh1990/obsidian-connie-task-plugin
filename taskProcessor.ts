export function confluenceTaskToObsidian(task: any, pageIdToMeta: Record<string, { title: string, webui: string }>): string {
  // Try to extract the description from the atlas_doc_format value
  let description = "";
  try {
    const atlasDoc = task.body?.atlas_doc_format?.value;
    if (atlasDoc) {
      const docObj = JSON.parse(atlasDoc);
      // Traverse the docObj to find text nodes only (exclude mentions)
      if (docObj.content && Array.isArray(docObj.content)) {
        for (const block of docObj.content) {
          if (block.type === "paragraph" && Array.isArray(block.content)) {
            for (const item of block.content) {
              if (item.type === "text" && item.text) {
                description += item.text;
              }
              // Skip mentions - don't include them in description
            }
          }
        }
      }
    }
  } catch (e) {
    // fallback to title or default message
    description = task.title || "Review the task";
  }
  
  // Better fallback if no description found (e.g., only mentions, no text)
  if (!description.trim()) {
    description = task.title || "Review the task";
  }

  // Extract and format due date if present
  let dueDateStr = "";
  if (task.dueDate) {
    let epoch = task.dueDate;
    if (typeof epoch === "string") epoch = parseInt(epoch, 10);
    if (!isNaN(epoch)) {
      const date = new Date(epoch * 1000);
      const iso = date.toISOString().slice(0, 10);
      dueDateStr = ` 📅 ${iso}`;
    }
  }

  // Add Confluence page link using hydrated page title and webui
  let linkStr = "";
  if (task.pageId && pageIdToMeta[task.pageId]) {
    const { title, webui } = pageIdToMeta[task.pageId];
    linkStr = ` [${title}](https://hello.atlassian.net/wiki${webui})`;
  }

  // Add task ID as hidden comment for duplicate detection
  const taskIdComment = task.id ? ` <!-- task-id: ${task.id} -->` : "";

  return `- [ ] ${description}${dueDateStr}${linkStr}${taskIdComment}`;
}

export function groupTasksByWeek(tasks: any[], pageIdToMeta: Record<string, { title: string, webui: string }>): string {
  // Group tasks by week
  const tasksByWeek = new Map<string, any[]>();
  
  for (const task of tasks) {
    const weekKey = getWeekKey(task.createdAt);
    if (!tasksByWeek.has(weekKey)) {
      tasksByWeek.set(weekKey, []);
    }
    tasksByWeek.get(weekKey)!.push(task);
  }
  
  // Sort weeks (most recent first)
  const sortedWeeks = Array.from(tasksByWeek.keys()).sort((a, b) => b.localeCompare(a));
  
  // Format output with week headings
  const sections: string[] = [];
  for (const weekKey of sortedWeeks) {
    const weekTasks = tasksByWeek.get(weekKey)!;
    const weekHeading = getWeekHeading(weekKey);
    const taskLines = weekTasks.map(task => confluenceTaskToObsidian(task, pageIdToMeta));
    
    sections.push(`### ${weekHeading}\n\n${taskLines.join("\n")}`);
  }
  
  return sections.join("\n\n");
}

function getWeekKey(createdAt: string): string {
  const date = new Date(createdAt);
  // Get the Monday of the week
  const monday = new Date(date);
  monday.setDate(date.getDate() - date.getDay() + 1);
  return monday.toISOString().slice(0, 10); // YYYY-MM-DD format
}

function getWeekHeading(weekKey: string): string {
  const monday = new Date(weekKey);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  
  const mondayStr = monday.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  const sundayStr = sunday.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  
  return `Week of ${mondayStr} - ${sundayStr}`;
} 