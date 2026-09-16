# Free-text search by name/description

Part of the [Enhanced Menu Search](README.md) epic.

## Context

Today `Menu.jsx` shows all dishes for the selected category with no way to search by keyword; a diner looking for a specific dish (e.g. "bruschetta") must scan the whole list. This spec adds a text search box that filters dishes by matching the query against name and description.

## User Stories

- As a diner, when I type a word into the menu search box, I want to see only dishes whose name or description contains that word, so that I can quickly find a specific dish without scrolling.
- As a diner, when I clear the search box, I want the full (category-filtered) menu to reappear, so that I can go back to browsing.

## Releases

- **Release 1 (MVP):** single search input above the menu grid; case-insensitive substring match on `name` and `description`; combines with the existing category filter (AND logic); live-updates as the user types (no submit button).
- **Release 2:** highlight matched text in results; keyboard shortcut to focus search.

## Acceptance Criteria

- GIVEN the menu page, WHEN I type "bruschetta" in the search box, THEN only dishes whose name or description contains "bruschetta" (case-insensitive) are shown.
- GIVEN a search query with no matches, WHEN results update, THEN the no-results state is shown ([spec 06](06-no-results-state.md)).
- GIVEN I have a category selected AND a search query entered, WHEN results are computed, THEN only dishes matching both are shown.
- GIVEN text in the search box, WHEN I clear it, THEN all dishes for the current category filter reappear.
- GIVEN I type leading/trailing whitespace only, WHEN results are computed, THEN it is treated as an empty query.

## Management Rules

- Matching is case-insensitive substring match (not fuzzy, not tokenized) against `name` and `description`.
- Query is trimmed before matching.
- Combines with all other active filters (category, dietary tags, price range) using AND logic.
- No minimum character count to start filtering.

## Edge Cases

- If the query contains special characters, then it's treated as a literal substring — implementation must not use the raw string as a regex without escaping (avoids a ReDoS/crash risk).
- If the matching word appears only in `description` and not `name` (or vice versa), then the dish still matches.
- If the user pastes a multi-line string, then it's matched as-is after trim.

## Tracking

| Event | Trigger | Properties | Success metric |
|---|---|---|---|
| `menu_search_performed` | Query becomes non-empty and filter is applied | `query_length`, `result_count` | Search usage rate |
| `menu_search_zero_results` | A non-empty query yields 0 dishes | `query_length` | Search miss rate (lower is better) |

## Rollout plan

- **Alpha:** internal only, feature-flagged.
- **Beta:** 100% of users, monitor zero-result rate.
- **Stable:** flag removed, default on.

## Testing plan

- Matches on name-only, description-only, and both.
- Combination with category filter.
- Clearing search restores prior view.
- Zero-result triggers the no-results state.
- `menu_search_performed` / `menu_search_zero_results` fire correctly.
