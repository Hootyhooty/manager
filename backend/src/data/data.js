/**
 * Static form options used by the tour creation wizard.
 *
 * Notes:
 * - Tours/customers/guides/reviews are stored in MongoDB collections.
 * - Keep these defaults here so the wizard can render without DB-seeding yet.
 */

export const meta = {
  destinations: ['Bangkok', 'Phuket', 'Chiang Mai', 'Krabi'],
  categories: ['Adventure', 'Culture', 'Food', 'Relaxation'],
  guideNames: ['John', 'Mike', 'Aom', 'Unassigned'],
}
