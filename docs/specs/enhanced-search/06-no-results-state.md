# "No results" empty state

Part of the [Enhanced Menu Search](README.md) epic.

## Context

Today, if the category filter yields zero dishes, `Menu.jsx` silently renders an empty grid with no message — there's no feedback that the diner's filters excluded everything. As this spec set adds search, dietary tags, and price range on top of category filtering, the chance of a zero-result combination goes up significantly, so a clear empty state becomes necessary. `Cart.jsx` already has a comparable pattern (`.cart-empty` / "No items yet.") to draw from.

## User Stories

- As a diner, when my search/filter/sort combination matches no dishes, I want to see a clear message explaining that nothing matched, so that I understand it's my filters — not a broken menu.
- As a diner, when I see the no-results state, I want an easy way to reset my filters, so that I can get back to browsing without manually undoing each one.

## Releases

- **Release 1 (MVP):** static message ("No dishes match your search and filters.") shown in place of the dish grid whenever the combined result set is empty, plus a "Clear all filters" action that resets search text, category selection, dietary tags, and price range to their defaults.
- **Release 2:** tailor the message to the active filters (e.g. "No vegan dishes under $10") — nice-to-have, not required for MVP.

## Acceptance Criteria

- GIVEN any combination of search/category/dietary/price filters, WHEN the combined result set is empty, THEN the dish grid is replaced by a "no results" message (not an empty grid with no explanation).
- GIVEN the no-results state is shown, WHEN I click "Clear all filters", THEN search text is emptied, category selection resets to "All", dietary tags are deselected, and the price range resets to its full default bounds, and the full dish list reappears.
- GIVEN the no-results state is showing, WHEN I change any single filter such that at least one dish matches, THEN the dish grid reappears automatically (no manual refresh needed).
- GIVEN zero filters/search are active (default state) AND the menu itself has at least one dish, THEN the no-results state never shows (it only triggers from user-applied filters producing zero matches, not from an empty menu).

## Management Rules

- The no-results state is a pure function of the final filtered+sorted result set: shown if and only if that set's length is 0.
- "Clear all filters" resets every filter introduced in [specs 01–04](README.md) simultaneously; it does not affect the cart.
- This state takes visual precedence over the sort control's effect (sorting an empty set is a no-op, per [spec 05](05-sort-results.md)).

## Edge Cases

- If `dishes` itself is empty (no menu data at all — not expected in this app, but worth naming), then this is a distinct "menu unavailable" condition, not the filter-driven no-results state, and is out of scope for this spec.
- If the user reaches zero results, then changes filters to a non-zero combination and back to a zero one repeatedly, then the state toggles correctly each time with no stale content flashing.

## Tracking

| Event | Trigger | Properties | Success metric |
|---|---|---|---|
| `menu_search_zero_results` (reused from [spec 01](01-free-text-search.md)) | A non-empty query yields 0 dishes | `query_length` | Search miss rate |
| `menu_filters_cleared` | "Clear all filters" clicked from the no-results state | — | Recovery rate from zero-result states (how often diners get back to browsing vs. abandoning) |

## Rollout plan

Ships alongside whichever of specs 01–04 is released first; each new filter type ships with the no-results state already covering it (no separate flag needed).

## Testing plan

- The message appears for zero results from every filter type individually and in combination.
- "Clear all filters" resets every filter and the message disappears.
- Regression: a non-empty result set never shows the no-results message.
- `menu_filters_cleared` fires correctly.
