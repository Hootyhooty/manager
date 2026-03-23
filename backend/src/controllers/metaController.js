import { meta } from '../data/data.js'

export function getMeta(_req, res) {
  res.json(meta)
}

