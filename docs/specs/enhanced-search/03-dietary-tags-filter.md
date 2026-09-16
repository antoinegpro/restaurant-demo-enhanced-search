# Dietary tags filter (vegetarian/vegan/gluten-free)

Part of the [Enhanced Menu Search](README.md) epic.

## Context

There is no dietary information anywhere in the app today — dishes only have `id`, `name`, `description`, `price`, `category`, `emoji`. Diners with dietary restrictions have no way to filter the menu to relevant dishes. This spec adds a `dietaryTags` field to the menu data and a multi-select filter for it.

## User Stories

- As a diner with a dietary restriction, when I select one or more dietary tags (vegetarian, vegan, gluten-free), I want to see only dishes carrying all of those tags, so that I can trust the menu shows things I can eat.
- As a restaurant operator (internal), when a dish is added or edited in the menu data, I want to be able to mark it with the dietary tags that apply, so that the filter reflects reality.

## Releases

- **Release 1 (MVP):** add `dietaryTags: string[]` field to each dish in `data.js` (values from a fixed set: `vegetarian`, `vegan`, `gluten-free`); add a multi-select dietary-tag filter UI alongside the category filter.
- **Release 2:** surface dietary tag icons/badges directly on each dish card (not just in the filter), and an admin UI to edit tags (no admin UI exists today — out of scope for MVP).

## Acceptance Criteria

- GIVEN I select "vegetarian", WHEN results update, THEN only dishes whose `dietaryTags` includes "vegetarian" are shown.
- GIVEN I select "vegetarian" AND "gluten-free", WHEN results update, THEN only dishes tagged with BOTH "vegetarian" AND "gluten-free" are shown (see Management Rules — AND, not OR).
- GIVEN no dietary tags are selected, WHEN the menu renders, THEN dietary filtering has no effect (all dishes eligible, subject to other filters).
- GIVEN a dish has no `dietaryTags` (empty array/undefined), WHEN any dietary tag filter is active, THEN that dish is excluded from results.
- GIVEN dietary tags are combined with category, search, or price filters, WHEN results are computed, THEN all active filters apply together (AND logic).

## Management Rules

- Dietary tag matching is AND across selected tags (a dish must satisfy every selected restriction, not just one) — this reflects that dietary restrictions are typically combined by a single diner (e.g. vegan AND gluten-free), not offered as alternatives.
- Fixed tag vocabulary for MVP: `vegetarian`, `vegan`, `gluten-free`. Adding new tag types requires a follow-up spec.
- Every dish in `data.js` must have a `dietaryTags` array (can be empty) once this ships — no dish should have the field `undefined`, to avoid ambiguous "unknown" states.
- This filter combines with category, search, and price range via AND logic, same as the other filters.

## Edge Cases

- If a dish is vegan, then it is not automatically assumed vegetarian or gluten-free in the data — each tag must be set explicitly (no implied hierarchy in MVP, to avoid incorrect assumptions about ingredients).
- If all dishes get filtered out by a dietary tag combination, then the no-results state is shown ([spec 06](06-no-results-state.md)).
- If `data.js` is edited and a dish is left without a `dietaryTags` field, then it should be treated as "no tags" (empty array), not cause a crash.

## Tracking

| Event | Trigger | Properties | Success metric |
|---|---|---|---|
| `menu_dietary_filter_changed` | Dietary tag selection changes | `selected_tags` | Dietary filter adoption rate, especially zero-result rate for tag combinations (signals menu gaps) |

## Rollout plan

- **Alpha:** internal, verify tag data accuracy for all 12 existing dishes before wider release (data-quality risk, since tags are retrofitted).
- **Beta:** 100% of users.
- **Stable:** default on.

## Testing plan

- AND-logic across multiple selected tags.
- Dishes with no tags are correctly excluded once a tag filter is active.
- Combination with other filters.
- Data QA: manually verify all 12 dishes in `data.js` have sensible `dietaryTags` before release.
