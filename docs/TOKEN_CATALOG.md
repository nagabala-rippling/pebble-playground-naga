# Pebble Design Tokens Catalog

**Quick reference for all Pebble design tokens with AI-friendly examples.**

> **📚 Full Token Docs:** See [`guides/tokens/`](./guides/tokens/) for complete auto-generated documentation from `@rippling/pebble-tokens`.
>
> **🎨 Live Demo:** See the "Design Tokens" demo in the playground to see all tokens in context.
>
> **♻️ Auto-Generated:** Token docs are automatically generated via `npm run generate-token-docs` from the `@rippling/pebble-tokens` npm package.

## ⚠️ Critical Rules

1. **ALWAYS use theme tokens, NEVER hardcode values**
   - ✅ `backgroundColor: theme.colorSurface`
   - ❌ `backgroundColor: 'white'`
2. **Access theme via hook in components**
   - `const { theme } = useTheme();`
3. **Theme tokens work in both light and dark modes**
4. **For styled components, access via props**
   - `styled.div\`color: \${({ theme }) => (theme as StyledTheme).colorOnSurface};\``

---

## Colors

### Accessing Color Tokens

```typescript
import { useTheme } from '@rippling/pebble/theme';

const MyComponent = () => {
  const { theme } = useTheme();

  return (
    <div style={{
      backgroundColor: theme.colorSurface,
      color: theme.colorOnSurface
    }}>
      Content
    </div>
  );
};
```

### Primary & Secondary Colors

| Token                 | Usage                                      | Example                      |
| --------------------- | ------------------------------------------ | ---------------------------- |
| `colorPrimary`        | Primary brand color (Berry: `#7a005d`)     | Buttons, links, focus states |
| `colorOnPrimary`      | Text/icons on primary background           | Button text                  |
| `colorPrimaryVariant` | Lighter primary shade                      | Hover states                 |
| `colorSecondary`      | Secondary accent color (Orange: `#ffa81d`) | Secondary actions            |
| `colorOnSecondary`    | Text/icons on secondary background         | Secondary button text        |

**Example:**

```typescript
<Button
  style={{
    backgroundColor: theme.colorPrimary,
    color: theme.colorOnPrimary
  }}
>
  Save
</Button>
```

### Surface Colors

| Token                   | Usage                      | Berry Light Value |
| ----------------------- | -------------------------- | ----------------- |
| `colorSurface`          | Default background         | `#ffffff`         |
| `colorOnSurface`        | Text on default background | `#15191C`         |
| `colorSurfaceDim`       | Slightly darker surface    | Page background   |
| `colorSurfaceBright`    | Elevated surface (cards)   | White             |
| `colorOnSurfaceVariant` | Secondary text             | Gray text         |

**Example:**

```typescript
<Card style={{
  backgroundColor: theme.colorSurfaceBright,
  color: theme.colorOnSurface
}}>
  <Title style={{ color: theme.colorOnSurface }}>Card Title</Title>
  <Description style={{ color: theme.colorOnSurfaceVariant }}>
    Secondary text
  </Description>
</Card>
```

### Semantic Colors

Used for status, feedback, and alerts.

| Base Token     | Container Token         | On Container Token        | Usage                              |
| -------------- | ----------------------- | ------------------------- | ---------------------------------- |
| `colorSuccess` | `colorSuccessContainer` | `colorOnSuccessContainer` | Success messages, completed states |
| `colorError`   | `colorErrorContainer`   | `colorOnErrorContainer`   | Errors, validation failures        |
| `colorWarning` | `colorWarningContainer` | `colorOnWarningContainer` | Warnings, caution states           |
| `colorInfo`    | `colorInfoContainer`    | `colorOnInfoContainer`    | Informational messages             |

**Container vs Base:**

- **Container colors** (`colorSuccessContainer`): Muted background for notices/alerts
- **Base colors** (`colorSuccess`): Brighter, for icons and borders
- **On-container colors** (`colorOnSuccessContainer`): Text/icons on container backgrounds

**Example:**

```typescript
// Success notice
<Notice style={{
  backgroundColor: theme.colorSuccessContainer, // Muted green background
  borderColor: theme.colorSuccess,              // Bright green border
  color: theme.colorOnSuccessContainer          // Dark text
}}>
  <Icon
    type={Icon.TYPES.CHECK}
    color={theme.colorSuccess}  // Bright green icon
  />
  Success!
</Notice>
```

### Border & Outline Colors

| Token                 | Usage            |
| --------------------- | ---------------- |
| `colorOutline`        | Standard borders |
| `colorOutlineVariant` | Subtle dividers  |

---

## Typography

### Accessing Typography Tokens

```typescript
import styled from '@emotion/styled';
import { StyledTheme } from '@/utils/theme';

const Heading = styled.h1`
  ${({ theme }) => (theme as StyledTheme).typestyleV2DisplayLarge};
  color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
`;
```

### Typography Categories

| Category    | Sizes                | Usage                  |
| ----------- | -------------------- | ---------------------- |
| **Display** | Large, Medium, Small | Page titles, hero text |
| **Title**   | Large, Medium, Small | Section headers        |
| **Body**    | Large, Medium, Small | Paragraph text         |
| **Label**   | Large, Medium, Small | Labels, captions       |

### Display Typography

Use for large, prominent text (page titles, hero sections).

| Token                      | Size | Weight         | Usage            |
| -------------------------- | ---- | -------------- | ---------------- |
| `typestyleV2DisplayLarge`  | 57px | 600 (Semibold) | Main page titles |
| `typestyleV2DisplayMedium` | 45px | 600            | Section titles   |
| `typestyleV2DisplaySmall`  | 36px | 600            | Card titles      |

### Title Typography

Use for section headers and subsection titles.

| Token                    | Size | Weight |
| ------------------------ | ---- | ------ |
| `typestyleV2TitleLarge`  | 22px | 600    |
| `typestyleV2TitleMedium` | 16px | 600    |
| `typestyleV2TitleSmall`  | 14px | 600    |

### Body Typography

Use for paragraph text and general content.

| Token                   | Size | Weight        | Usage              |
| ----------------------- | ---- | ------------- | ------------------ |
| `typestyleV2BodyLarge`  | 16px | 400 (Regular) | Large body text    |
| `typestyleV2BodyMedium` | 14px | 400           | Standard body text |
| `typestyleV2BodySmall`  | 12px | 400           | Small body text    |

### Label Typography

Use for form labels, captions, metadata.

| Token                    | Size | Weight |
| ------------------------ | ---- | ------ |
| `typestyleV2LabelLarge`  | 14px | 600    |
| `typestyleV2LabelMedium` | 12px | 600    |
| `typestyleV2LabelSmall`  | 11px | 600    |

**Example:**

```typescript
import styled from '@emotion/styled';
import { StyledTheme } from '@/utils/theme';

const Container = styled.div`
  h1 {
    ${({ theme }) => (theme as StyledTheme).typestyleV2DisplayLarge};
    color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  }

  p {
    ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
    color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  }

  label {
    ${({ theme }) => (theme as StyledTheme).typestyleV2LabelMedium};
    color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
  }
`;
```

---

## Spacing

### Spacing Scale

All spacing tokens use an 8px base unit for consistency.

| Token      | Value | Usage                             |
| ---------- | ----- | --------------------------------- |
| `space100` | 4px   | Tight spacing (icon gaps)         |
| `space200` | 8px   | Small spacing (button padding)    |
| `space300` | 12px  | Medium-small spacing              |
| `space400` | 16px  | Standard spacing (card padding)   |
| `space500` | 20px  | Medium spacing                    |
| `space600` | 24px  | Large spacing (section gaps)      |
| `space700` | 28px  | Extra large spacing               |
| `space800` | 32px  | Very large spacing (page margins) |

**Example:**

```typescript
import styled from '@emotion/styled';
import { StyledTheme } from '@/utils/theme';

const Card = styled.div`
  padding: ${({ theme }) => (theme as StyledTheme).space600};
  gap: ${({ theme }) => (theme as StyledTheme).space400};
  margin-bottom: ${({ theme }) => (theme as StyledTheme).space800};
`;
```

---

## Border Radius (Shape)

| Token             | Value  | Usage                               |
| ----------------- | ------ | ----------------------------------- |
| `shapeCornerXs`   | 2px    | Extra small elements                |
| `shapeCornerSm`   | 4px    | Small elements (badges)             |
| `shapeCornerMd`   | 6px    | Medium elements                     |
| `shapeCornerLg`   | 8px    | Standard elements (buttons, inputs) |
| `shapeCornerXl`   | 10px   | Large elements                      |
| `shapeCorner2xl`  | 12px   | Extra large elements (cards)        |
| `shapeCorner3xl`  | 16px   | 3XL elements (modals, large panels) |
| `shapeCorner4xl`  | 24px   | 4XL elements (special cards)        |
| `shapeCornerFull` | 9999px | Fully rounded (pills, avatars)      |

**Example:**

```typescript
import styled from '@emotion/styled';
import { StyledTheme } from '@/utils/theme';

const Button = styled.button`
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
`;

const Card = styled.div`
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner2xl};
`;

const Modal = styled.div`
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCorner3xl};
`;
```

---

## Size Tokens

Used for component sizing (icon sizes, input heights, etc.).

| Token     | Value | Usage                         |
| --------- | ----- | ----------------------------- |
| `size300` | 24px  | Extra small (XS input height) |
| `size400` | 32px  | Small (S input height)        |
| `size500` | 40px  | Medium (M input height)       |
| `size600` | 48px  | Large (L input height)        |

---

## Using Tokens in Styled Components

```typescript
import styled from '@emotion/styled';
import { useTheme } from '@rippling/pebble/theme';
import { StyledTheme } from '@/utils/theme';

// Method 1: Via props (for styled components)
const StyledCard = styled.div`
  background-color: ${({ theme }) => (theme as StyledTheme).colorSurface};
  padding: ${({ theme }) => (theme as StyledTheme).space600};
  border-radius: ${({ theme }) => (theme as StyledTheme).shapeCornerLg};
  border: 1px solid ${({ theme }) => (theme as StyledTheme).colorOutlineVariant};

  h2 {
    ${({ theme }) => (theme as StyledTheme).typestyleV2TitleLarge};
    color: ${({ theme }) => (theme as StyledTheme).colorOnSurface};
    margin-bottom: ${({ theme }) => (theme as StyledTheme).space400};
  }

  p {
    ${({ theme }) => (theme as StyledTheme).typestyleV2BodyMedium};
    color: ${({ theme }) => (theme as StyledTheme).colorOnSurfaceVariant};
  }
`;

// Method 2: Via hook (for inline styles)
const MyComponent = () => {
  const { theme } = useTheme();

  return (
    <div style={{
      backgroundColor: theme.colorSurface,
      padding: theme.space600,
      borderRadius: theme.shapeCornerL
    }}>
      Content
    </div>
  );
};
```

---

## Theme Switching

```typescript
import { useTheme, useThemeSettings } from '@rippling/pebble/theme';

const ThemeToggle = () => {
  const { name: currentThemeName } = useTheme();
  const { changeTheme } = useThemeSettings();

  const toggleTheme = () => {
    const newTheme = currentThemeName === 'berry-light'
      ? 'berry-dark'
      : 'berry-light';
    changeTheme(newTheme);
  };

  return (
    <Button onClick={toggleTheme}>
      Toggle Dark Mode
    </Button>
  );
};
```

---

## Complete Token Reference

For the complete list of all tokens with exact values, see:

- **[Colors](./guides/tokens/colors.md)** - All color tokens with hex values
- **[Typography](./guides/tokens/typography.md)** - All typography tokens with font specs
- **[Spacing](./guides/tokens/spacing.md)** - All spacing and sizing tokens

These files are auto-generated from `@rippling/pebble-tokens`. Run `npm run generate-token-docs` to update.

---

## See Also

- [Component Catalog](./COMPONENT_CATALOG.md) - Component usage reference
- [AI Prompting Guide](./AI_PROMPTING_GUIDE.md) - AI-friendly patterns
- [Design Guidelines](./guides/README.md) - Complete design system docs
