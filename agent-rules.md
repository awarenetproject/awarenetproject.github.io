# Agent rules

If you are an agent, you must read, understand, and follow these rules before performing any task.

This document contains **project-specific configurations and constraints** for the specific project.

---

## Project Information

- **Project Name:** AWARENET_WEB

- **Location:**

`/Users/emmatosato/Documents/PhD/PhD Local Projects/awarenet_web/`

- **Purpose:** Web page development

---

## Environment Setup

### Conda Environment


- The environment must be activated before running any command or script. This is **MANTORY**.
- The environment for this project: `awarenet`
  
```bash

conda activate awarenet

```

* The conda environment name must not be inferred or changed.  

### Logs

- A project MUST have a logs folder. If it doesn't exist, create it.
- For each main task, create a log subfolder in the main logs folder. 
- All the log files related to that task MUST be stored in the task's log subfolder.
- The log files inside the task's log subfolder MUST be differentiable, so pay attention to the name of the log files.

---

## Context gathering

In order to perform tasks, you must first gather context information about the project:
1. Visualize all the directories and files in the project with the command `ls -R` or `tree`. 
2. Then explore the content of the files to understand the project structure and the purpose of each file.
3. Pay attention if there are any documentation files or folder that can help you understand the project.

---

## Language Rules

* **Code and documentation:** English only

* **Chat language:**
	* If the user writes in Italian, respond in Italian

- Italian is allowed **only in the chat**, never in:
	- source code
	- comments
	- documentation
	- configuration files

---

Failure to follow these rules is considered a violation of the project constraints.