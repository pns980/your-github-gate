# Rebrand roadmap

- [x] Apply the Perfec™ palette, fonts, logo, and compact visual system.
- [x] Add responsive public and admin workspace navigation.
- [x] Align public, admin, authentication, legal, and error pages.
- [x] Preserve and verify existing workflows at desktop and mobile sizes.
- [x] Add copy and share actions to the Scenario Helper response.

## Open

- [ ] Restore guidance record saving for visitors who are not admins. Records are
      written with `.insert(...).select('id')`, but only admins may read the table,
      so the write is rejected (401) and the like/dislike rating has nothing to
      attach to. Needs a backend helper that returns the new record's id while
      keeping the table admin-only readable.
