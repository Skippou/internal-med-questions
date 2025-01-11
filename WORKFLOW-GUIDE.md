# Question Creation Workflow Guide

## Prerequisites
- GitHub Copilot subscription
- A text editor with GitHub Copilot support
  * VS Code with GitHub Copilot Chat extension (recommended, verified workflow)
  * Other editors may work but might have different shortcuts/features

## Step 1: Open Context Files
1. Open your editor (instructions below use VS Code shortcuts)
2. Open the internal-med-questions workspace
3. Access context files:
   - VS Code: Press `Ctrl+K Ctrl+M`
   - Other editors: Manually open:
     * .copilot-instructions.md
     * questions/cardiology/acute/acuteCoronarySyndrome.md
     * questions/cardiology/shortform/arrhythmias.md
     * questions/pulmonology/ards/ventStrategy.md

## Step 2: Use GitHub Copilot
1. Access Copilot Edits:
   - VS Code: Press `Ctrl+Shift+I`
   - Other editors: Use editor-specific GitHub Copilot commands
2. Select "Claude-3 Sonnet" if available in your editor
   - Provides the most consistent medical content
3. Create ONE question at a time using clear prompts like:
   ```
   Create a single [difficulty] question about [specific topic]. Focus on [specific aspect/scenario].
   ```

   Good examples:
   ```
   Create a single medium difficulty question about initial management of diabetic ketoacidosis focusing on the first 6 hours of care
   ```
   ```
   Create a single shortform question about first-degree AV block diagnosis focusing on ECG criteria
   ```

4. Review the suggested file location and content
5. Click "Accept" to create the file with the generated content

## Step 3: Quality Check
1. Verify medical accuracy:
   - Check current guidelines
   - Verify statistics and numbers
   - Confirm drug dosages
   - Validate lab value ranges
2. Review question structure:
   - Correct YAML frontmatter with today's date
   - All required sections present
   - Proper unit formatting
   - Clear, unambiguous wording
3. Consider educational value:
   - Tests important concepts
   - Reflects current practice
   - Teaches through explanation
   - Links to evidence

## Step 4: Version Control
1. Commit each question individually
2. Use descriptive commit messages:
   ```
   Add: DKA initial management question
   Update: Heart block ECG criteria
   Fix: Corrected lab values in sepsis question
   ```
3. Push changes regularly to backup work

## Tips for Better Results
- Be specific with your prompt:
  ```
  Create a hard question specifically about timing of antibiotics in sepsis
  ```
- Reference existing files:
  ```
  Create a single question like #acuteCoronarySyndrome.md but focusing only on NSTEMI diagnosis
  ```
- Build on existing content:
  ```
  Create a follow-up question to #ventStrategy.md focusing specifically on PEEP selection
  ```

## Common Commands (VS Code)
- `Ctrl+K Ctrl+M` - Open all context files
- `Ctrl+Shift+I` - Open GitHub Copilot Edits
- `/fix` - Ask Copilot to fix issues in the current file
- `/test` - Ask Copilot to help write test cases

## Troubleshooting
- If question quality drops: Try regenerating with a different model
- If content is outdated: Check the latest guidelines and ask for an update
- If structure is wrong: Reference a specific example file in your prompt
- If your editor lacks certain features: Consider using VS Code for question creation workflow
