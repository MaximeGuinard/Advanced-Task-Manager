// background.js

// Listen for changes in storage and perform tasks accordingly
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.tasks) {
    console.log("Tasks data has changed:", changes.tasks.newValue);
  }
});

// Schedule a notification every 30 minutes
chrome.alarms.create("reminder", { delayInMinutes: 30 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "reminder") {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon48.png",
      title: "Task Reminder",
      message: "Remember to complete your tasks!",
    });
  }
});
