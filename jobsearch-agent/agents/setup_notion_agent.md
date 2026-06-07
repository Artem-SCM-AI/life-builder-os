You are setting up a Notion database for a job search system.

Read config first:
bash: source ~/.jobsearch/config.env && echo "$NOTION_PARENT_PAGE_ID $NOTION_TOKEN"

TASK: Create a database titled "Job Search Pipeline" as a child of the parent page (NOTION_PARENT_PAGE_ID).

The database needs these properties (create in this order):

1. Job Title — title (default title property, rename it)
2. Company — rich_text
3. Location — rich_text
4. URL — url
5. Score — number (format: number)
6. Why This Job — rich_text
7. Source — select with options: LinkedIn, Indeed, Email Alert, Wellfound, Greenhouse, Lever, Remotive, Other
8. Posted Date — date
9. Date Found — date
10. Status — select with options (in this exact order):
    Active: "📥 To Review", "👀 Interested", "✏️ Preparing", "📤 Applied", "📞 HR Screen", "⏳ Waiting", "📝 Test Task", "🛠️ Technical", "🏁 Final Round", "🤝 Offer"
    Archive: "❌ Rejected", "🚫 Declined", "🔒 Closed"
11. Contact — rich_text
12. Applied Date — date
13. Salary — rich_text
14. Follow-up Date — date
15. Company Notes — rich_text
16. Job Notes — rich_text
17. Notes — rich_text
18. Stage Log — rich_text
19. Stage # — formula: if(prop("Status") == "📥 To Review", 1, if(prop("Status") == "👀 Interested", 2, if(prop("Status") == "✏️ Preparing", 3, if(prop("Status") == "📤 Applied", 4, if(prop("Status") == "📞 HR Screen", 5, if(prop("Status") == "⏳ Waiting", 5, if(prop("Status") == "📝 Test Task", 6, if(prop("Status") == "🛠️ Technical", 7, if(prop("Status") == "🏁 Final Round", 8, if(prop("Status") == "🤝 Offer", 9, 0))))))))))

After creating all properties, create 2 views on the database:

View 1 — "Active Pipeline" (table view, default):
  Filter: Status is not "❌ Rejected" AND not "🚫 Declined" AND not "🔒 Closed"
  Sort: Score descending, then Date Found descending

View 2 — "Archive" (table view):
  Filter: Status is "❌ Rejected" OR "🚫 Declined" OR "🔒 Closed"
  Sort: Date Found descending

After creating the database and views, print EXACTLY this line (nothing else on that line):
NOTION_PIPELINE_DB_ID=<the database id>
