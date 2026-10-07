# Assumptions

- The historical samples are usable for metadata engineering, but no paired photograph is assumed freely licensed because its object's metadata is CC0.
- Preserve catalogue date wording. Missing numeric bounds remain null; do not turn ca., circa, century or era wording into invented precise years.
- The chronology supports integer years -9999..-1 and 1..9999, without a historical year zero. Positive centuries denote CE and negative centuries BCE; a range crossing the era boundary skips century zero.
- Structured catalogue ranges support a computed century range, not a new independently corroborated historical claim. All short fact lines remain null and unverified.
- Cooper Hewitt metadata is CC0 but its photographs are explicitly excluded. The AIC snapshot marks the six objects public domain, but exact image-file permission is not verified here.
- AIC descriptions are omitted; its license statement treats descriptions differently from other metadata. No unknown-license portrait, composite cover or unrelated HDR landscape is redistributed.
- The full pack should curate visual surprises and roughly 500+ objects after actual licensed image inspection. The metadata fallback does not measure modern/ancient appearance.
- Build-time Pillow performs image encoding. Offline TypeScript logic is strict ES2022 and has no runtime dependencies or network calls.
- Untagged RGB, palette and grayscale inputs use the sRGB convention. Tagged inputs require a compatible ICC profile and are converted to sRGB with alpha preserved. Invalid or incompatible profiles, and untagged CMYK/LAB inputs, are rejected before destination writes.
- Use the existing isolated checkout; preserve concurrent claims and do not create a worktree unless explicitly requested.
