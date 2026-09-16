# Sort by price/popularity

Part of the [Enhanced Menu Search](README.md) epic.

## Context

Dishes are always shown in their fixed `data.js` order (grouped by category as authored). There's no way to sort by price or by how often a dish is ordered. Popularity is defined as order count, but this app has no real order-history tracking — for this demo, popularity is seeded as fake/placeholder data directly on each dish (see the `popularity` field added to `data.js`) rather than blocking the feature on real tracking infrastructure.

## User Stories

- As a diner, when I choose "Sort by price", I want dishes reordered from lowest to highest price (or the reverse), so that I can browse cheapest-first or find premium options.
- As a diner, when I choose "Sort by popularity", I want the most-ordered dishes shown first, so that I can quickly see what other diners like.

## Releases

- **Release 1 (MVP):** sort dropdown with "Price: low to high", "Price: high to low", and "Popularity: most ordered"; applies to the already-filtered result set. Ships together with a new seeded `popularity` field (plausible fake order-count integers) added to each dish in `data.js`.
- **Release 2:** replace the seeded `popularity` values with real order-history tracking once that infrastructure exists — same field, real data source, no UI change expected.

## Acceptance Criteria

- GIVEN the default view, WHEN no sort is chosen, THEN dishes appear in their existing category-grouped order (unchanged from today).
- GIVEN I choose "Price: low to high", WHEN results render, THEN the filtered dishes are ordered by ascending `price`.
- GIVEN I choose "Price: high to low", WHEN results render, THEN the filtered dishes are ordered by descending `price`.
- GIVEN I choose "Popularity: most ordered", WHEN results render, THEN dishes are ordered by descending `popularity`, with tied values falling back to original menu order.
- GIVEN two dishes share the same price, WHEN sorted by price, THEN their relative order is stable (falls back to original menu order) so the list doesn't jitter on re-render.
- GIVEN search/category/dietary/price filters are active, WHEN a sort is applied, THEN sorting happens on the already-filtered result set (filter then sort, not sort then filter).

## Management Rules

- Sorting is applied after all filters (search, category, dietary tags, price range) — sort never changes which dishes are shown, only their order.
- Sort is a single-select choice (one active sort key at a time), not combinable (e.g. no "price then popularity" compound sort in MVP).
- `popularity` (integer) is seeded/placeholder demo data for Release 1, not derived from real orders — must be clearly understood internally as fake until Release 2 replaces it with real tracking.
- Every dish must have a `popularity` value (no `undefined`), same rule as the `dietaryTags` field in [spec 03](03-dietary-tags-filter.md), to avoid ambiguous sort positions.

## Edge Cases

- If the result set is empty after filtering, then the sort control still renders but has no visible effect (no-results state per [spec 06](06-no-results-state.md) takes precedence).
- If the result set has exactly one dish, then sorting is a no-op.
- If two dishes have identical `popularity` values, then they keep their original relative menu order (stable sort), same tie-breaking rule as price sort.

## Tracking

| Event | Trigger | Properties | Success metric |
|---|---|---|---|
| `menu_sort_changed` | User selects a different sort option | `sort_key` (`price_asc` / `price_desc` / `popularity`), `result_count` | Sort usage rate, and which sort key is most used |

## Rollout plan

- **Alpha:** internal, both sort keys, using seeded popularity data.
- **Beta:** 100% of users.
- **Stable:** default on. Release 2 (real order-tracking data replacing the seed) rolls out separately once that data exists, with no expected change to this spec's UI/acceptance criteria.

## Testing plan

- Ascending/descending price sort correctness and stability on ties.
- Popularity sort correctness and stability on ties, against seeded data.
- Sort applies after filters, not before.
- Default (unsorted) view matches today's existing menu order exactly (no regression).
