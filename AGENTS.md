# AGENTS.md

This file provides guidelines for AI agents operating within this email viewer repository.

## Build, Lint, and Test Commands

- **Build**: `pnpm run build` (using pnpm as the main package manager)
- **Lint**: `pnpm run lint` (using pnpm as the main package manager)
- **Dev**: `pnpm run dev` (start development server)
- **Preview**: `pnpm run preview` (preview production build)

## Code Style Guidelines

### Package Manager
- Always use `pnpm` as the main package manager for all JavaScript/Node.js projects

### Imports
- Keep imports organized and grouped: third-party, then local
- Use `.js` extensions for local imports (mixed JS/TS codebase)
- Example: `import { EmailList } from './components/EmailList.js';`

### Types & Formatting
- Use TypeScript for static typing where applicable
- Interfaces for component props: `interface EmailListProps { ... }`
- Variables/Functions: camelCase
- Classes/Components: PascalCase
- Constants: SCREAMING_SNAKE_CASE

### Component Patterns
- Use functional components with hooks
- Follow existing patterns for state management
- Use Tailwind CSS for styling and shadcn/ui components
- Import icons from lucide-react

### Error Handling
- Implement robust error handling with try-catch blocks
- Use meaningful error messages and console.error for debugging
- Graceful fallbacks for failed operations

### File Structure
- Components in `src/components/`
- Services in `src/services/`
- Utilities in `src/utils/`
- UI components in `src/components/ui/`

### CSV Processing
- Use CSVParser class for parsing CSV files
- Handle complex quoted fields and line breaks
- Clean HTML content and decode entities
- Validate email body content for readability

### Git Operations
- **IMPORTANT**: Never commit or push changes without explicit user prompt
- Always wait for user instruction before running `git add`, `git commit`, or `git push`
- Provide summary of changes before asking for commit/push permission