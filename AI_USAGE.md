# AI_USAGE.md

## AI Tools Used

* **ChatGPT** - For debugging, architecture planning, implementation guidance, code review, edge-case identification, and UX improvements.
* **Cursor** - For planning tasks, maintaining a development checklist, and reviewing implementation progress.

---

## How I Used AI During Development

I primarily used AI as a thinking partner while building the project. Instead of generating the entire solution, I used it to:

* Break down the assignment requirements into smaller tasks.
* Plan the frontend and backend architecture.
* Identify missing features before submission.
* Review implementation decisions.
* Improve UX flows and edge-case handling.
* Verify that the final solution satisfied all mandatory requirements.

---

## Representative Prompts Used

### Project Planning (I have asked ChatGPT & Cursor itself to give me the prompts I have used throughout this project)

-> "I have uploaded a document, I have to do this assignment as a part of a recruitment process. And, I want to use React (for frontend) and MongoDB + Node.js (for backend). Firstly, give me the gist on what arre we making?"

-> "Give me a brief project structure/map such that I can connect the dots."

-> "Draft me a prompt in order to make a flow chart for design in my mind."

-> "i have implemented most of the tasks. but, i want to know what is pending as of now and what do we have to implement? and also, if there are any bonus points, do let me know. And, tell me what all is pending?"

---

### Form Flow & Validation

-> "Okay, lets build this one by one. Firstly, let's implement the validation correct flow. and the correct previous/next button. Plan a to-do list for me such that I can check those boxes when done."

-> "i have tested the validation flow, everything is working fine. now, tell me what else do we have left to implement?"

-> "i will add this AI_USAGE.md in the last. as of now, I want to implement the logic behind the working of steps, the count should be calculated by (steps completed/ total steps)(Req 3) and we display that on the card itself such that the user can easily identify, which form requires attention and which one does not.

-> After implementing this, I want to implement the edge-case handling as there will be certain times where the following conditions can occur- Invalid step or form submissions, Invalid field values, Missing required fields, Broken form configuration."

---

### User Experience Improvements

-> "The flow is working fine now, the validation, edge cases are being handled in the right way possible. Now, I want to implement the functionality that when I create a form and in the middle of it, I try to leave it, the data will be saved. And, when I continue in the future, the data gets rendered on the screen where we left it. How can I implement this functionality? Give me the gist behind it and how to think logically for this, without giving the exact solution."

-> "okay, so i have found a bug. like when we click on leave without saving, it still saves that as draft. this is a major bug right? tell me how we can fix this and implement it"

---

### Debugging & Troubleshooting

-> "I have pushed everything to GitHub but for some reason the latest changes are not showing up on the repo. The commit exists locally and git status is clean. How can I systematically debug whether this is a branch issue or remote issue?"

-> "When i click on continue, it’s rendering a blank page. I have tried to inspect it, but the page being rendered is still the dashboard page, while it should be the stepperform page, right?"

-> "everything compiles successfully and there are no console errors, but the page is rendering blank after I introduced the new routing changes. How can i debug this step by step instead of going from one file error to another file giving the same error?"

-> "The API call is returning a successful response and I can see the data in the Network tab, but the UI is still not updating. The state seems correct at first glance. What are the common things you would check in React for a bug like this?"

-> "There is a glitch happening between the pages. i think one of my states is not being handled well. I am uploading the states and where they are being called, tell me the possible issue for this one"

```js
const [searchQuery, setSearchQuery] = useState("");
const [statusFilter, setStatusFilter] = useState("all");
const [viewMode, setViewMode] = useState("list");
const [filterOpen, setFilterOpen] = useState(false);
const [createOpen, setCreateOpen] = useState(false);
const [newTitle, setNewTitle] = useState("");
const navigate = useNavigate();
```

---

## What I Modified From AI Output

* Adapted AI suggestions to fit the project structure I had already created.
* Refactored generated code to match my component organization and naming conventions.
* Simplified some implementations to keep the codebase easier to maintain.
* Adjusted styling and UI decisions to better match the design direction I wanted.
* Reworked parts of the unsaved-changes flow after testing revealed UX issues.

---

## What AI Got Wrong

* Some suggested UI implementations did not align with the desired design and required manual refinement.
* Initial modal styling felt cluttered and needed redesign.
* Certain edge cases around draft saving and navigation were not handled correctly in the first implementation.
* A few suggestions solved the immediate problem but were more complex than necessary, so they were simplified during development.

---

## How I Verified Correctness

* Manually tested all form navigation flows.
* Tested validation on every step before submission.
* Verified draft saving and draft resuming functionality.
* Tested completed submissions from creation through final submission.
* Verified dashboard updates after creating, editing, and submitting forms.
* Tested edge cases such as leaving the form midway, saving drafts, and discarding changes.
* Reviewed assignment requirements and matched implemented features against the specification before submission.
