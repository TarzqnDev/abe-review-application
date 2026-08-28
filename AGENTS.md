## Next.js Rules

- Always place all the application code inside the /src folder
- Always add the custom paths "@/*": ["./src/*"], "@/public/*": ["./public/*"] in tsconfig.json
- Always use @ directives when you import files which coming from the /src folder, dont start the path with “../” when importing files coming from /src folder
- All database interactions logic should be handled in server actions or next api routes or dedicated backend server like express, follow the pattern in this project if it is using server actions or next api or dedicated server when talking to database, don't add the logics for database interaction/communication in the custom hooks because it will be harmful for the hackers

## File Structuring Guidelines

### NextJS Project Structure

File Structure (textual representation with one example per area and notes)

```
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
```

Notes:
- Use the app/ directory for screens and routing — route groups are wrapped in parentheses (e.g., (auth)), and layout.tsx files compose layout/ navigation.
- Put feature-specific logic (hooks, small components, skeletons) under src/features/<feature>/, mirror the file structuring from the original /app screen file to the hooks that you are going to create for that screen.
- Shared UI primitives go in src/components/ui/.
- Providers that must wrap layouts (AuthProvider, theme, etc.) live in src/providers/ and are typically used in layout.tsx.
- Configured clients (e.g., Supabase) and environment-driven values belong in src/config/ and .env respectively — never commit secrets.
- Keep one representative file per area when explaining structure; actual folders may contain multiple related files (hooks, components, loaders).