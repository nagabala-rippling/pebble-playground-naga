/**
 * Shared types for App Shell components.
 *
 * These are the main data structures a designer's agent will use when
 * customising the sidebar navigation.
 */

export interface NavItemData {
  /** Unique identifier — used as the React key */
  id: string;
  /** Display label shown in the sidebar */
  label: string;
  /** Pebble icon type — use Icon.TYPES.* (e.g. Icon.TYPES.LAPTOP_OUTLINE) */
  icon: string;
  /** Show a chevron indicating a sub-menu (visual only in the prototype) */
  hasSubmenu?: boolean;
  /** Highlight this item as the currently active page */
  isActive?: boolean;
  /** Callback when the item is clicked (e.g. navigate to a route) */
  onClick?: () => void;
  /**
   * Whether clicking this item navigates into a super app.
   * Only relevant in the Home view for items with chevrons.
   * Set to false for Favorites and Custom Apps.
   */
  navigable?: boolean;
}

export interface NavSectionData {
  /** Optional section heading displayed above the items (e.g. "Platform") */
  label?: string;
  items: NavItemData[];
}

/** Navigation configuration for a single super app view */
export interface SuperAppNavConfig {
  /** Optional country selector shown above the top section */
  countrySelector?: {
    /** Available countries. `flagCode` is an uppercase ISO 3166-1 alpha-2 code (e.g. "US"). */
    options: { label: string; value: string; flagCode?: string }[];
    /** Default selected value */
    defaultValue: string;
  };
  /** Items shown above the divider (e.g. overview, "my" items) */
  topSection: NavSectionData;
  /** Items shown below the divider (main nav items) */
  mainSection: NavSectionData;
}

export interface AppShellConfig {
  companyName?: string;
  userInitial?: string;
  showAdminMode?: boolean;
  searchPlaceholder?: string;
  logoClickHandler?: () => void;
}
