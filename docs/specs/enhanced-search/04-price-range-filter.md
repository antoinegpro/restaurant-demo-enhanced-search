# Price range slider

Part of the [Enhanced Menu Search](README.md) epic.

## Context

Dishes range from the cheapest starter to the priciest main, but there's no way to filter by budget. This spec adds a price range slider so diners can narrow the menu to what fits their budget.

## User Stories

- As a diner, when I set a minimum and/or maximum price, I want to see only dishes within that price range, so that I can browse within my budget.
- As a diner, when I open the menu, I want the slider's bounds to reflect the actual min/max prices on the menu, so that the full usable range is available from the start.

## Releases

- **Release 1 (MVP):** single price-range slider (dual-handle) with bounds computed from `Math.min`/`Math.max` of all dish prices in `data.js`; filters dishes whose `price` falls within [min, max] inclusive.
- **Release 2:** numeric input fields alongside the slider for precise entry (keyboard-accessible alternative to dragging).

## Acceptance Criteria

- GIVEN the menu page loads, WHEN the price slider first renders, THEN its lower bound equals the lowest dish price and its upper bound equals the highest dish price in the current dataset.
- GIVEN I drag the slider to a narrower range, WHEN results update, THEN only dishes with `price >= selectedMin AND price <= selectedMax` are shown.
- GIVEN the slider is at its full default range (untouched), WHEN the menu renders, THEN price filtering has no effect (all dishes eligible, subject to other filters).
- GIVEN I combine the price range with category/search/dietary filters, WHEN results are computed, THEN all active filters apply together (AND logic).
- GIVEN I set min > max by dragging one handle past the other, THEN the handles cannot cross (min handle is clamped at the max handle's position and vice versa).

## Management Rules

- Range bounds are inclusive on both ends.
- Range is filtered against the dish's `price` field, unmodified (no rounding/currency conversion).
- Bounds are computed dynamically from the current `dishes` array (not hardcoded), so the slider stays correct if menu items are added/removed/repriced.
- Combines with all other filters via AND logic.

## Edge Cases

- If all dishes have the same price, then the slider still renders with a single usable point (min == max) rather than breaking.
- If the selected range excludes every dish, then the no-results state is shown ([spec 06](06-no-results-state.md)).
- If a dish's price changes in `data.js` after page load (not expected in this static-data app, but noted for future dynamic data), then the slider bounds should be recomputed the next time the menu data reloads.

## Tracking

| Event | Trigger | Properties | Success metric |
|---|---|---|---|
| `menu_price_filter_changed` | User releases a slider handle (after drag ends, not on every pixel of movement) | `selected_min`, `selected_max` | Price filter usage rate |

## Rollout plan

Alpha → Beta → Stable, standard rollout, no special data dependency.

## Testing plan

- Bounds are computed correctly from current dish prices.
- Inclusive range filtering at both edges (dish priced exactly at min or max is included).
- Handles can't cross.
- Combination with other filters and the zero-result path.
