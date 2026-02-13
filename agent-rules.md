# Agent rules
If you are an agent, you MUST read, understand, and strictly follow all rules in this document BEFORE performing any task.

This document defines project-specific configurations, constraints, and operational procedures that override any default behavior.

All rules are mandatory. No exception is allowed. Failure to comply invalidates the task execution.

---
## Project Information

- **Project Name:** awarenet_web
- **Location:**

```

/Users/emmatosato/Projects/PhD/<Project_Name>

```

---
## Environment Setup

### Conda Environment

- The environment must be activated before running any command or script. This is **MANDATORY**
- The conda environment name must not be inferred or changed.
- The environment name for this project: `awarenet`

```bash

conda activate <enviroment_name>

```

---
## Context gathering

In order to perform tasks, you must first gather context information about the project:

1. You MUST list the repository structure using `tree -a -L 4`. If `tree` is unavailable, use `ls -R` or `find . -maxdepth 4`. You MUST exclude large or generated directories from the listing (e.g., `node_modules/`, `.venv/`, `dist/`, `build/`, `__pycache__/`). The generated directory tree serves as the reference map for all subsequent steps.
2. You MUST search for project documentation in `docs/`, `doc/`, or `documentation/`. If present, you MUST read it first. Start from the main index file (e.g., `docs/README.md`) and follow all relevant links or referenced files. Documentation is assumed to describe the intended architecture and usage of the project. If the documentation is missing, incomplete, or outdated, you MUST:
	- Identify which information is missing.
	- Inspect the relevant source files to reconstruct that information.
	- Explicitly report that the documentation is incomplete or inconsistent.

--- 


## Language Rules
* **Code and documentation:** English only
* **Chat language:** If the user writes in Italian, respond in Italian
- Italian is allowed **only in the chat**, never in:
	- source code
	- comments
	- documentation
- configuration files
- You **MUST NOT** use emoticons. Especially
	- in the code
	- in the documentation
	Is very important you respect this!