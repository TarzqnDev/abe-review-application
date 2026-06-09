**General Rules**

- Use high level tools, built in classes and apis existed in the programming language we are using or external existed packages rather than manually coding everything from scratch like doing for loops and etc. unless it is needed
- Always seperate the logic codes of specific screen/pages to its own custom hook (match the name of custom hook to the page/screen name, for example if the page/screen is homepage/homescreen, the filename of the custom hook will be "useHome"), the goal is to make the original page/screen file to have the pure ui/ux codes only, follow our file structuring below
- Always separate each component ui, modals, utilities, helpers, configs, constants, hooks, providers to its own file so that we have organization, follow our file structuring below
- Don’t use single letters (m, y, d, a) naming convention for variables and even with callback parameters, it should be always a word
- Don’t overly add comments, just add comments if it is necessary
- Don’t add comments for your new changes or update or fix, just see the overall code per file and add comments if you think the code is confusing
- Group the modals components usage in every page/screen and add comments label above so that the developer knows it is modals section

**Next.js Rules**

- Always place all the application code inside the /src folder
- Always add the custom paths "@/*": ["./src/*"], "@/public/*": ["./public/*"] in tsconfig.json
- Always use @ directives when you import files which coming from the /src folder, dont start the path with “../” when importing files coming from /src folder
- All database interactions logic should be handled in server actions or next api routes or dedicated backend server like express, follow the pattern in this project if it is using server actions or next api or dedicated server when talking to database, don't add the logics for database interaction/communication in the custom hooks because it will be harmful for the hackers

**UI rules**

- Always format dates with proper names with month name (January 3, 2003), avoid displaying date with just hyphens like 01-03-2003
- Always format time with proper format (9:05 PM), default to use regular time format (AM, PM) unless i told you to use military time format

**NextJS Project Structure**

File Structure (textual representation with one example per area and notes)

project-name/
├─ src/                          # Application source code
│  ├─ app/                       # Route files and layouts (App Router)
│  │  ├─ layout.tsx              # Root layout wrapped around all pages (providers, metadata)
│  │  ├─ page.tsx                # Landing page / app entry route
│  │  ├─ globals.css             # Global styles
│  │  ├─ (auth)/                 # Auth route group (pages not accessible inside the main app)
│  │  │  └─ login/page.tsx       # Example auth page — sign-in UI
│  │  └─ (app)/                  # Protected/main application routes
│  │     ├─ layout.tsx           # App-level layout (sidebar, navbar, shared UI)
│  │     └─ admin/
│  │        └─ dashboard/page.tsx# Example dashboard page
│  │
│  ├─ features/                  # Feature-scoped business logic (mirror the file structuring from the main page in app)
│  │  └─ admin/
│  │     └─ dashboard/
│  │        └─ hooks/
│  │           └─ useAdminDashboard.ts # Feature hook example
│  │
│  ├─ components/                # Reusable UI components and layout components
│  │  └─ ui/
│  │     └─ custom-button.tsx    # Shared UI component example
│  │
│  ├─ providers/                 # Global React providers and contexts
│  │  └─ AuthProvider.tsx        # Authentication provider example
│  │
│  ├─ hooks/                     # Reusable custom hooks shared across features
│  │  └─ useDebounce.ts          # Generic hook example
│  │
│  ├─ utils/                     # Pure utility/helper functions
│  │  └─ formatDate.ts           # Utility function example
│  │
│  ├─ lib/                       # Shared infrastructure and framework-related code
│  │  └─ supabase/
│  │     └─ client.ts            # Supabase client initialization
│  │
│  ├─ config/                    # Application configuration and constants
│  │  └─ appConfig.ts            # Global configuration example
│  │
│  ├─ services/                  # External API calls and service layer
│  │  └─ authService.ts          # Authentication API example
│  │
│  ├─ types/                     # Shared TypeScript interfaces and type definitions
│  │  └─ user.ts                 # User-related types example
│  │
│  ├─ constants/                 # Static values used throughout the app
│  │  └─ roles.ts                # User roles example
│  │
│  ├─ validations/               # Zod schemas and form validation rules
│  │  └─ loginSchema.ts          # Login form validation example
│  │
│  └─ assets/                    # Static assets imported by the application
│     └─ images/
│        └─ logo.png             # Application logo example
│
├─ public/                       # Public static files accessible directly via URL
│  └─ authBackground.jpg         # Example background image
│
├─ supabase/                     # Supabase local configuration and templates
│  └─ config.toml                # Supabase project configuration
│
├─ database.types.ts             # Database-generated TypeScript types
├─ next-env.d.ts                 # Next.js TypeScript declarations
├─ next.config.ts                # Next.js configuration
├─ eslint.config.mjs             # ESLint configuration
├─ postcss.config.mjs            # PostCSS configuration
├─ tsconfig.json                 # TypeScript configuration
├─ .env                          # Environment variables (secrets — do not commit)
├─ package.json                  # Package manifest
└─ README.md                     # Project documentation

Notes:
- Use the app/ directory for screens and routing — route groups are wrapped in parentheses (e.g., (auth)), and layout.tsx files compose layout/ navigation.
- Put feature-specific logic (hooks, small components, skeletons) under src/features/<feature>/, mirror the file structuring from the original /app screen file to the hooks that you are going to create for that screen.
- Shared UI primitives go in src/components/ui/.
- Providers that must wrap layouts (AuthProvider, theme, etc.) live in src/providers/ and are typically used in layout.tsx.
- Configured clients (e.g., Supabase) and environment-driven values belong in src/config/ and .env respectively — never commit secrets.
- Keep one representative file per area when explaining structure; actual folders may contain multiple related files (hooks, components, loaders).

# CRITICAL RULES - MUST FOLLOW

## RESPONSES

- Keep responses concise and to the point - unless the user asks otherwise

## PLANNING MODE

- Always ask clarifying questions
- Never assume design, tech stack or features
- Use deep-dive sub-agents to assist with research
- Use deep-dive sub-agents to review the different aspects of your plan before presenting to the user

## CHANGE / EDIT MODE

- Never implement features yourself when possible - use sub-agents!
- Identify changes from the plan that can be implemented in parallel, and use sub-agents to implement the features efficiently
- When using sub-agents to implement features, act as a coordinator only
- Use the best model for the task - premium models for complex tasks (like coding) and mid-tier models for simpler tasks, like documentation
- After completing features (large or small), always run commands like lint, type check and build commands to check code quality
- When editing existing files in this project, copy the original codes 100% even the existing comments and only modify what i have requested you to modify
- Always use nativewind for styling the UI except if the styling will be dynamic (use the default StyleSheet for that) or the styling is really complex and not possible to achieve with just using nativewind
- No need to give me summary for your whole changes, applying the changes is already enough for me

## DATABASE SCHEMA CHANGES

- Whenever you make changes to the database schema, ALWAYS run the drizzle generate and migrate commands
- NEVER run drizzle push!

## TESTING

- Use any testing tools, libraries available to the project for testing your changes
- Never assume your changes simply work, always test!
- If the project does not have any testing tools, scripts, MCP tools, skills, etc. available for testing, ask the user whether testing should be skipped.

## UI DESIGN

- Always follow the UI design system when creating or reviewing components or pages
- Design System: @DESIGN.md
