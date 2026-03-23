import { Guide, Tour } from '../models/index.js'
import { formatDateLabel, formatMoneyThb } from '../utils/tourUtils.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const getGuides = asyncHandler(async (_req, res) => {
  const tours = await Tour.find({ status: 'Published' })
    .select('_id title dateFrom pricePerPerson tourGuide maxTravelers')
    .lean()

  if (!tours.length) return res.json([])

  const guideNames = [
    ...new Set(tours.map((t) => String(t.tourGuide || '').trim()).filter(Boolean)),
  ]
  if (!guideNames.length) return res.json([])

  const guideDocs = await Guide.find({ name: { $in: guideNames } }).lean()
  const guideByName = new Map(guideDocs.map((g) => [g.name, g]))

  const firstTourByGuide = new Map()
  for (const t of tours) {
    const name = String(t.tourGuide || '').trim()
    if (!name) continue
    if (!firstTourByGuide.has(name)) firstTourByGuide.set(name, t)
  }

  const rows = guideNames.map((name) => {
    const g = guideByName.get(name)
    const t = firstTourByGuide.get(name)
    const toursCost = t
      ? `${t.title} / ${formatDateLabel(t.dateFrom)} / ${
          t.pricePerPerson != null ? formatMoneyThb(t.pricePerPerson) : '—'
        }`
      : '—'

    return {
      name,
      toursCost: toursCost || g?.toursCost || '—',
      address: g?.address ?? '—',
      phone: g?.phone ?? '—',
      status: g?.status ?? 'Active',
      remark: g?.remark ?? '',
    }
  })

  rows.sort((a, b) => a.name.localeCompare(b.name))
  res.json(rows)
})

