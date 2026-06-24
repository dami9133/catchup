<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Auto-Deployment Rule
Whenever you (Antigravity) implement a new feature or modify the code successfully and the user is satisfied, or if the user explicitly asks you to deploy/save, YOU MUST automatically commit and push the code to the origin repository. 
Use the `run_command` tool to execute: `git add . ; git commit -m "[Auto] Your commit message" ; git push`
Do not ask the user to push it themselves. You now have the token configured in the remote URL.
