# Feature specification · LetMallow iconography

**Created** 21/11/2026

The [LetMallow brand artboard](https://claude.ai/artifact/MPR5UqG6jxKJ9W43LGPm2r#artboard-3d8175ac14d9) defines the site's interface and app icons. The approved logo lockup is outside this feature.

- **FR-001** Use Lucide outlines on a 24-unit grid with a 2-unit stroke and rounded caps and joins. Use 24px navigation icons, 20px icons next to body text and 16px icons for compact controls or metadata. Icons with labels inherit the adjacent text colour. A saved area's heart and the current Saved navigation heart fill with Cobalt.
- **FR-002** Keep native select behaviour and give search and form selects the Lucide chevron, including at narrow widths. Preserve accessible control names and state announcements.
- **FR-003** Use transparent marshmallow artwork for browser and home-screen icons. The 16px and 32px favicon images use the simplified faces-free mascots. Larger web app and Apple touch icons use the full mascot pair. Publish a manifest linking to the web app icons on both hosts.
- **FR-004** Advance the version to `0.1.0-alpha.3` and commit the increment to the brand-kit feature branch.

## Acceptance

Inspect the shared interface in a browser. Toggle a saved area, open search and navigation controls, and confirm the icons on small and large screens. Check that the Sites and Netlify builds expose the same icon links and that each declared file loads and has the stated dimensions. Run the existing service suites.
