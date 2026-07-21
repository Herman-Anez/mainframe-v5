# Handoff — Once UI Storybook reference

## What this is
Interactive component reference for the `@once-ui-system/core` (v1.7.12) library used by this Next.js app, built with Storybook 10. Goal: browse/tweak every Once UI component live instead of digging through the app.

## Status: complete, uncommitted
122 story files in `src/stories/once-ui/*.stories.tsx`, covering 123 of Once UI's exported components (one file, `Gradient.stories.tsx`, covers both `LinearGradient` + `RadialGradient`). **Nothing has been committed yet** — `git status` shows everything as modified/untracked. Review and commit when ready.

**Important**: the package's public surface is bigger than `dist/components/`. It also has a `dist/modules/` tree (navigation, code, data/charts, media, seo) which the root barrel re-exports too (`export * from "./modules"` in `dist/index.d.ts`) — so everything in there is importable exactly like `dist/components/` stuff, straight from `@once-ui-system/core`. The first full pass of this session only scanned `dist/components/` and missed all of `dist/modules/` (caught when the user pointed at `docs.once-ui.com/once-ui/modules/megaMenu`). If doing a completeness check again, scan **both** trees:
```bash
find node_modules/@once-ui-system/core/dist/components node_modules/@once-ui-system/core/dist/modules -name "*.d.ts"
```

Not covered (intentionally skipped — internal/non-visual, or not a renderable component):
- From `dist/components/`: `ClientFlex`/`ClientGrid`/`ServerFlex`/`ServerGrid` (Row/Column/Flex/Grid's internal split), `index`, `ArrowNavigationContext`, `ElementType`, `InteractiveDetails`, `Option` (used inside Select/Dropdown only), `ListItem` (demoed inside the List story), `FocusTrap`/`ScrollLock` (render nothing), `ThemeInit` (app bootstrap only), `StyleOverlay`/`StylePanel` (Once UI's own dev-tool UI), `Cursor` (internal to cursor-follow effects)
- From `dist/modules/`: `Meta` — NOT a React component, it's a Next.js metadata helper (`Meta.generate(...)` returns a `Metadata` object for `export const metadata = ...`). Documented anyway via a small wrapper story (`Meta.stories.tsx`) that renders the generated JSON for reference, but flagged here since it breaks the "every story = a live component" pattern. `Swatch` (in `dist/modules/data/`) is not re-exported from `modules/index.d.ts`, so it's not actually part of the public API — skipped.

## How to run
```bash
pnpm exec storybook dev -p 6006
```
Open http://localhost:6006/. Sidebar is grouped into 13 categories under **Once UI**: Actions, Forms, Data Display, Feedback, Overlay, Navigation, Layout, Typography, Media, Effects, Code, SEO, Charts (set via `title: 'Once UI/<Category>/<Name>'` in each story's `meta`).

## Verification commands (use both after any story edit)
```bash
pnpm exec tsc --noEmit                          # type-check
pnpm exec vitest --project storybook run         # real headless-Chromium render check via Playwright — the reliable "does it actually render" test, not just curl/type-check
```
Currently: both clean. 124 test files / 171 tests passing (124 = 122 component stories + 2 pre-existing app-page stories).

## Story file pattern
Each file is CSF3:
```tsx
const meta = {
  title: 'Once UI/<Category>/<ComponentName>',
  component: ComponentName,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: '...' } } },  // 1-2 sentence description, shown on Docs page
  argTypes: { propName: { control: '...', description: '...' } },  // every argType has a description now
  args: { ... },
} satisfies Meta<typeof ComponentName>;
```
Each file has a `Default` story (live Controls) plus 1-2 more showing variants/states side-by-side. Components needing controlled state (Select, Checkbox, Switch, Dialog, etc.) use a `render` wrapper with `useState`, not bare `args`.

To add a new component story: copy the pattern from a similar existing file, read `node_modules/@once-ui-system/core/dist/components/<Name>.d.ts` for exact prop shapes, add it to the category map (see below), verify with both commands above.

## Known issues / gotchas

1. **`storybook build` (production static export) is broken** — pre-existing bug in `@once-ui-system/core@1.7.12` itself, not caused by this work. `ClientGrid.js`/`ClientFlex.js` do `import { useLayout } from ".."`, which collides with the package's `exports` map under Vite's rolldown bundler → `Could not load .../dist/dist/index.js`. Reproduced even with zero custom stories (just the original `page.stories.tsx`). Only affects `build-storybook`; `storybook dev` is unaffected. Not fixable without patching `node_modules` or waiting on an upstream fix.

2. **`__dirname is not defined`** — Next's `ua-parser-js` (pulled in transitively by Once UI's server-only exports like `handleOGFetch`) breaks under Vite/ESM. Fixed in **two places**, both needed:
   - `vitest.config.ts` (`define: { __dirname: ... }`)
   - `.storybook/main.ts` (`viteFinal` adds the same `define`) — this one was missing originally and caused `storybook dev` to hang forever loading stories even though `vitest --project storybook run` passed. If stories ever hang on load again after touching `.storybook/main.ts`, check this first.

3. **Two dev-server instances on port 6006 fighting each other** caused the same infinite-hang symptom once. If `storybook dev` acts up: `lsof -ti:6006 | xargs -r kill -9`, then restart clean. Also clear `node_modules/.cache/storybook` if `main.ts`/`preview.tsx` config changed.

4. **`next/image` domain restrictions** — external image URLs (e.g. `picsum.photos`) fail in stories unless whitelisted in `next.config.mjs`. Avoided by using the local `/images/og/home.jpg` asset (or `unoptimized: true` where the component exposes it, e.g. `Media`) instead of touching the app's image config.

5. Some Once UI components ship prop defaults that don't play well standalone — e.g. `Banner` defaults to `solid="brand-medium"` internally, so passing `background` too throws a "cannot use both" console warning; `WeatherFx`'s built-in default `colors` includes a design-token string that fails `canvas.addColorStop` (pass explicit hex colors instead, see `WeatherFx.stories.tsx`).

6. Package manager: **pnpm only**. A stray `package-lock.json` was deleted this session (setup log confirmed pnpm was used for the actual Storybook install; `pnpm-workspace.yaml`/`pnpm-lock.yaml` are canonical).

7. **Components that call `next/navigation` hooks (`useRouter`, `usePathname`) need explicit story parameters**, or they throw `invariant expected app router to be mounted` — `@storybook/nextjs-vite` mocks these hooks automatically, but only once the story opts in via:
   ```ts
   parameters: {
     nextjs: { appDirectory: true, navigation: { pathname: '/' } },
   },
   ```
   Hit this with `Kbar` (calls `useRouter`/`usePathname` unconditionally on mount to close itself on navigation). See `Kbar.stories.tsx` for the working pattern. If a new story from `dist/modules/navigation/` (or anything importing Next router hooks) throws this error, add the same block.

8. **`dist/modules/*.impl.d.ts` files have the real prop names**, not the barrel `.d.ts`. E.g. `CodeBlock`'s public type only says `import type { CodeBlockProps } from "./CodeBlock.impl"` — the actual prop is `codes` (an array of `{ code, language, label }`), not something guessable from the barrel alone. Same for `MediaUpload` → `onFileUpload`, not `onFileSelect`. When adding a modules-based story, read the `.impl.d.ts` file, not just the `.d.ts` one.

## Category map (for adding new stories)
```
Layout:       Row, Column, Flex, Grid, Line, Scroller, ScrollContainer, MasonryGrid, SplitView, Banner
Typography:   Heading, Text, InlineCode, BlockQuote, Kbd
Actions:      Button, IconButton, ToggleButton, SmartLink
Forms:        Input, Textarea, Select, Checkbox, Switch, RadioButton, TagInput, ColorInput, DateInput,
              DatePicker, DateRangeInput, DateRangePicker, NumberInput, PasswordInput, OTPInput, Slider,
              SegmentedControl
Data Display: Tag, Badge, Avatar, AvatarGroup, Card, Table, List, Chip, Timeline, LogoCloud, OgCard,
              Icon, User, UserMenu, StatusIndicator
Feedback:     Feedback, Toast, Toaster, ProgressBar, Spinner, Skeleton, Pulse
Overlay:      Dialog, Modal, Tooltip, Dropdown, DropdownWrapper, ContextMenu, HoverCard, EmojiPicker,
              EmojiPickerDropdown
Navigation:   NavIcon, ScrollToTop, ThemeSwitcher, Accordion, AccordionGroup, MegaMenu, MobileMegaMenu,
              Kbar, HeadingLink, HeadingNav
Media:        Media, Logo, Carousel, Swiper, CompareImage, Mask, Background, InfiniteScroll, AutoScroll,
              MediaUpload
Effects:      Animation, Arrow, BlobFx, CelebrationFx, CountdownFx, CountFx, CursorCard, Fade,
              FadingLettersFx, FlipFx, GlitchFx, HoloFx, Hover, LetterFx, MatrixFx, Particle, RevealFx,
              ShineFx, TiltFx, TypeFx, WeatherFx
Code:         CodeBlock
SEO:          Meta, Schema
Charts:       BarChart, LineChart, PieChart, LineBarChart, RadialGauge, LinearGauge, ChartHeader,
              ChartStatus, DataTooltip, Legend, LinearGradient + RadialGradient (both in Gradient.stories.tsx)
```

The last five categories (Navigation's mega-menu/kbar/heading entries, Media's MediaUpload, Code, SEO, Charts) all come from `dist/modules/`, not `dist/components/` — see the note at the top about scanning both trees.

## Other things learned this session
- Once UI has **no MDX rendering component**. It has `CodeBlock` (Prism syntax highlighting — "markdown" is just one of many *highlightable languages*, not a renderer) and a `data` module with chart components (BarChart/LineChart/PieChart/LineBarChart/RadialGauge/LinearGauge via Recharts, all now documented under the **Charts** category). For actual MDX rendering, bring in `next-mdx-remote` or `@mdx-js/react`/`@next/mdx` separately and style the output with Once UI's `Text`/`Heading`/`InlineCode` via the MDX `components` prop map.
- `storybook-onceui-next-config.md` (repo root) has the original narrative of how Storybook was wired up for this Once UI + Next.js combo — read that first for setup history/rationale if anything here is unclear.
