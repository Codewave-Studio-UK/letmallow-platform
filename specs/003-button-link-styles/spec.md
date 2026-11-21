# LetMallow button and link styles

Date 21/11/2026

App version `0.1.0-alpha.5`, following the responsive browsing sprint (`0.1.0-alpha.4`).

## User stories and acceptance

1. I can spot the main action by its Cobalt fill, white Nunito Bold text and 10px corners. Secondary actions follow the artboard's outlined style. Short text actions and actual links remain easy to recognise.
2. I can see hover, keyboard focus, selected filters, the current navigation item and disabled controls. Confirmations for deleting, withdrawing or removing an advert use the brand error colour.
3. On a phone, I can tap search, filters, saved areas, the list/map toggle and map controls without horizontal scrolling. On larger screens, the existing split view and full navigation remain available.
4. Account, enquiries, provider links, plans, dialogs and footer destinations retain their existing behaviour. Both host builds use the same control styles.

[LetMallow brand artboard](https://claude.ai/artifact/MPR5UqG6jxKJ9W43LGPm2r#artboard-3d8175ac14d9)

## Navbar

Use the artboard's light colours and typography for the navbar. On desktop, the white row contains the LetMallow logo, horizontal Explore, Wanted adverts and Plans controls, Saved, Messages and the Sky-tinted account button. Below 768 CSS px, show only the logo at the left and a hamburger button at the far right. The hamburger opens a dropdown anchored to the navbar, with Saved areas, Messages, the other navigation destinations and the Alpha badge. It supports keyboard opening, Escape, outside dismissal and closes when a destination is selected. The navbar stays at the top as the page scrolls on all screen sizes. On screens with a sticky results toolbar, it sits below the navbar. The navbar has no search bar. The homepage search and results toolbar remain available. Messages uses the existing account enquiries.
