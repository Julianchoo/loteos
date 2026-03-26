# Project Commands

This directory contains slash commands for managing the Fitzroya Desarrollos real estate project system.

## Available Commands

### `/create-project`
Create a new real estate project from scratch.

**Use when:**
- Adding a brand new project to the platform
- Need to set up database records, pages, and navigation for a new development

**What it does:**
1. Creates database records in PostgreSQL and Airtable
2. Creates project page with financing calculator
3. Adds navigation links
4. Sets up lead capture system

**Example:** Creating "Arroyo de la Cruz" project

---

### `/rename-project`
Rename an existing project (name and/or ID).

**Use when:**
- Need to change the project's display name
- Need to change the project's URL slug/ID
- Need to update both name and ID

**What it does:**
1. Creates update scripts for PostgreSQL and Airtable
2. Updates database records
3. Renames project folder and files
4. Updates all code references
5. Updates navigation

**Example:** Renaming "Guernica" to "San Nicolás" (keeping location as "Guernica, Buenos Aires")

**Important:** Project name ≠ Location. A project can be called "San Nicolás" and be located in "Guernica".

---

### `/checkpoint`
Create a detailed git commit for your changes.

**Use when:**
- You've completed a meaningful chunk of work
- Want to save progress with a descriptive commit message

---

### `/create-spec`
Create a specification document for a new feature.

**Use when:**
- Planning a major feature or change
- Need to document requirements and implementation plan

---

### `/publish-to-github`
Publish a feature specification to GitHub Issues and Projects.

**Use when:**
- Want to track a feature in GitHub
- Ready to move from planning to implementation tracking

---

### `/continue-feature`
Continue implementing the next task for a GitHub-published feature.

**Use when:**
- Working on a feature that's tracked in GitHub
- Ready to implement the next task in the plan

---

## Quick Reference

| Task | Command | Files Affected |
|------|---------|----------------|
| Add new project | `/create-project` | DB, page files, navigation, scripts |
| Rename project | `/rename-project` | DB, page files, navigation, scripts |
| Save progress | `/checkpoint` | Git history |
| Plan feature | `/create-spec` | /specs directory |
| Track in GitHub | `/publish-to-github` | GitHub Issues/Projects |
| Continue work | `/continue-feature` | Feature tasks |

## Project Management Best Practices

### When Adding a New Project

1. Use `/create-project` command
2. Gather all required information first:
   - Project ID (URL slug)
   - Display name
   - Description
   - Location
   - Total area and lots
   - Base price
3. Follow the command prompts
4. Test the lead capture flow
5. Commit with `/checkpoint`

### When Renaming a Project

1. **IMPORTANT**: Understand the difference between:
   - **Project Name**: What the project is called (e.g., "San Nicolás")
   - **Project ID**: The URL slug (e.g., "san-nicolas")
   - **Location**: Where it's physically located (e.g., "Guernica, Buenos Aires")

2. Use `/rename-project` command
3. Confirm all changes with the command
4. Let the command handle all updates
5. Verify in both databases (PostgreSQL and Airtable)
6. Test the project page loads correctly
7. Commit with `/checkpoint`

### Common Mistakes to Avoid

❌ **Don't manually edit database records** - Use the update scripts
❌ **Don't confuse project name with location** - They are separate fields
❌ **Don't forget to update navigation** - Users won't find renamed projects
❌ **Don't skip database verification** - Always check both PostgreSQL and Airtable

✅ **Do use the provided commands** - They ensure consistency
✅ **Do verify changes in all systems** - Database, website, navigation
✅ **Do commit after successful updates** - Keep version control clean
✅ **Do test the lead capture flow** - Ensure Airtable integration works

## Files and Directories

```
.claude/commands/
├── README.md                  # This file
├── create-project.md          # New project creation guide
├── rename-project.md          # Project renaming guide
├── checkpoint.md              # Git commit helper
├── create-spec.md             # Feature specification creator
├── publish-to-github.md       # GitHub integration
└── continue-feature.md        # Feature implementation helper
```

## Related Documentation

- [Leads System Documentation](../../docs/LEADS_SYSTEM.md) - How the lead capture system works
- [Database Schema](../../src/lib/schema.ts) - PostgreSQL table definitions
- [Project Component](../../src/components/project-lead-form.tsx) - Lead form component

## Need Help?

If you're unsure which command to use:

1. **Adding something new?** → `/create-project`
2. **Changing existing name/ID?** → `/rename-project`
3. **Saving your work?** → `/checkpoint`
4. **Planning a feature?** → `/create-spec`

When in doubt, ask Claude Code for guidance by describing what you want to do.
