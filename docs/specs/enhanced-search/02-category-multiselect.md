# Multi-select category filter

Part of the [Enhanced Menu Search](README.md) epic.

## Context

Today's category filter (`Menu.jsx` `CATEGORIES` constant, `App.jsx` `selectedCategory` state) only allows one category at a time ("All", "Starters", "Mains", "Desserts"). A diner wanting to see both Starters and Desserts must switch back and forth, losing their place. This spec turns it into a multi-select.

## User Stories

- As a diner, when I select more than one category, I want to see dishes from all selected categories at once, so that I don't have to browse them one at a time.
- As a diner, when no category is selected, I want to see all dishes, so that the empty-selection state isn't a dead end.

## Releases

- **Release 1 (MVP):** convert category buttons to toggleable multi-select (checkbox-style buttons); "All" acts as a shortcut that clears other selections and shows everything; selecting any specific category deselects "All".
- **Release 2:** persist last-used category selection across sessions (out of scope for MVP).

## Acceptance Criteria

- GIVEN no categories selected (or "All" selected), WHEN the menu renders, THEN dishes from every category are shown.
- GIVEN I select "Starters" and then also select "Desserts", WHEN results update, THEN dishes from both Starters and Desserts are shown, and no others.
- GIVEN "Starters" and "Desserts" are selected, WHEN I click "All", THEN both are deselected and all dishes show again.
- GIVEN a specific category is selected, WHEN I click "All", THEN "All" becomes the only active selection.
- GIVEN two categories are selected, WHEN I deselect both individually, THEN the view behaves as if "All" were selected (shows everything).

## Management Rules

- Selection state becomes a set/array of category names instead of a single string.
- "All" and specific categories are mutually exclusive: selecting "All" clears specific selections; selecting any specific category while "All" is active removes "All" from the selection.
- Category filter combines with search, dietary tags, and price range via AND logic.
- The list of selectable categories continues to come from the fixed set already used today (Starters, Mains, Desserts) — deriving categories dynamically from data is out of scope for this spec.

## Edge Cases

- If every specific category is individually selected (Starters + Mains + Desserts), then behavior is equivalent to "All" being selected (all dishes shown) — the UI should visually reflect this (e.g. auto-switch highlight to "All") to avoid a confusing redundant state.
- If a selected category has zero matching dishes after other filters (search/dietary/price) are applied, then that's a normal zero-result path ([spec 06](06-no-results-state.md)), not an error.

## Tracking

| Event | Trigger | Properties | Success metric |
|---|---|---|---|
| `menu_category_filter_changed` | Category selection set changes | `selected_categories`, `selected_count` | Filter usage rate / multi-select adoption |

## Rollout plan

Alpha → Beta → Stable, standard rollout, no special sequencing dependency.

## Testing plan

- Multi-select toggle behavior and "All" mutual-exclusivity rules above.
- Combination with search/dietary/price filters.
- Regression: existing single-category selection still works as a subset of multi-select behavior.
