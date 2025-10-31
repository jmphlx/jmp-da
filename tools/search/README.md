# Advanced Search and Replace Tool

## Overview

The **Advanced Search and Replace Tool** is a Adobe Authoring tool that expands the search capabilities within the document repository and allows for more specific replace actions. 

This tool enables Block-Centric searches, in addition to full html searches. It allows you to search by element tag, attribute, block, or property —- and perform targeted replacements across the document tree. Built for developers and content managers, it offers fine-grained control over HTML manipulation while maintaining DOM integrity. The UI is designed with content managers in mind to enable a clear and concise user experience.

This tool also provides the publish status of pages and allows for searching based on publish status.

---

## Features

### Search
- **Live Fetching** – Load and manipulate HTML from remote URLs.
- **Block Identification** - Identify named blocks and property rows within that block.
- **HTML Element Search** - Find pages/elements based on html tags and attributes, such as class, href, etc.
- **Publish Status Search** - Find pages based on whether it has existing preview or publish URLs.
- **Empty Search** - Within an identified block, look for a row of a given name that has an empty value.
- **UI Controls** – Easily build a search query using interactive dropdowns that can be tailored based on org/repo.
- **Case Sesnsitive Search** - Optional case-sensitive matching
- **Deep DOM Parsing** – Uses the `DOMParser` API to analyze HTML documents in full DOM context.
- **Default Directory Scope** - To prevent un-intended large searches, a page/folder path is provided by default.
- **Custom Path Search** – Using additional pageviewer tool, search directory can be identified in a modal.

### Modify
- **Replace Text** - Easily replace text as you search using additional checkbox and input field.
- **Data Persistence** – Save modifications back to the author document.

#### For Block/Property Searches
- **Advanced Text Modification** - Text can be prepended, replaced, or appended. Text can also be identified as a multi-field and each value updated.
- **Add a Row** - A new row with user provided name and value may be appended to the block (2-column only)
- **Delete Row** - A row within a block can be deleted based on name.
- **Merge Rows** - A row may be combined with another named row in the same block. If the other row doesn't exist, the user has the option to create it.

### Content Management
- **Detailed, expandable results** - Each page result can be expanded to show specific matches within that match. Publish status is also indicated at the page level.
- **Bulk Versioning** - With one click, a set of pages can be versioned prior to making any changes.
- **Undo** - If an action is performed that did not have the intended consequence, the user can reset all pages modified back to the previous state at time of search.
- **Easy Access to Bulk Publishing** - A list of search results may be copied to the clipboard and then pasted into the linked Bulk Editor for speedy publication.

### Configuration
- **User Access Controls** - Only authorized users may view and perform extensive replace actions, as defined in a permissions sheet.

Features may be expanded to include exporting a list of results to CSV.

---

## How It Works

1. A user can build a query using form elements, which are populated relative to the org/repo.
  a. A starting path must be specified. One is provided by default. The pagetree viewer tool is utilized to
  provide a modal for selecting a path.
  b. Search parameters can include a block, property, html tag, html attribute, publish status and search keywords.
2. When the search is executed, the tool fetches all pages under the given path.
3. For each page, the tool fetches the HTML document and parses the content into a DOM structure.
4. Based on the user defined parameters, pages are adding to result list.
5. Results are provided in a detailed list, showing all matches on a given page, as well as the page's publish status.
6. From here, authors can fill out another form to define a modification action on the block or property.
  a. Modifications include replacing text, adding a property, deleting a property, or merging two properties.
7. When action is submitted, the HTML is updated and saved back to Author. The list of pages changed is maintained in the results.
8. A user may select a copy button to copy the URLs of changed pages for Bulk Publish/Preview/Versioning actions in the Bulk Editor.

---

## File Organization
search.html - Main app interface
search/search.css - Styles
search/search.js - Main App logic
search/ui.js - Creates search result elements and adds event listeners to forms 
search/README.md - This documentation

Optional Add-On
pagetree/pagetree.html - Additional tool that provides an interface for navigating a tree view of pages and directories
pagetree/pagetree.js - Page tree app logic
pagetree/pagetree.css - Page tree styles
pagetree/README.md - Page Tree tool documentation
