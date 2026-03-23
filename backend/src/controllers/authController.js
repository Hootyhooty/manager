import { createHash } from 'node:crypto'

import { Creator } from '../models/index.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const login = asyncHandler(async (req, res) => {
  const rawUsername = String(req.body?.username ?? '').trim()
  const name = rawUsername || 'User'

  // Demo behavior: accept any password and upsert creator by username.
  let creator = await Creator.findOne({ username: name }).lean()
  if (!creator) {
    creator = await Creator.create({ username: name, name })
  }

  // If this creator has a passwordHash and the client sent a password,
  // validate it. Otherwise keep demo behavior.
  const rawPassword = String(req.body?.password ?? '')
  if (creator.passwordHash && rawPassword) {
    const candidateHash = createHash('sha256').update(rawPassword).digest('hex')
    if (candidateHash !== creator.passwordHash) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }
  }

  res.json({ user: { name: creator.name || creator.username } })
})

export const registerCreator = asyncHandler(async (req, res) => {
  const body = req.body ?? {}

  const username = String(body.username ?? '').trim()
  const password = String(body.password ?? '')
  const email = String(body.email ?? '').trim()
  const firstName = String(body.firstName ?? '').trim()
  const surname = String(body.surname ?? '').trim()
  const phoneNumber = String(body.phoneNumber ?? '').trim()
  const address = body.address ?? null

  if (!username) return res.status(400).json({ error: 'username is required' })
  if (!password) return res.status(400).json({ error: 'password is required' })
  if (!email) return res.status(400).json({ error: 'email is required' })
  if (!firstName) return res.status(400).json({ error: 'firstName is required' })
  if (!surname) return res.status(400).json({ error: 'surname is required' })
  if (!phoneNumber) return res.status(400).json({ error: 'phoneNumber is required' })

  // If you're allowing address selection, store it as the reverse-geocoded object.
  // If MapModal isn't used, this can be null/empty.
  const safeAddress = address && typeof address === 'object' ? address : null

  const candidateHash = createHash('sha256').update(password).digest('hex')
  const displayName = `${firstName} ${surname}`.trim()

  // Upsert by username so repeated registrations update missing fields.
  const existing = await Creator.findOne({ username }).lean()
  if (existing) {
    await Creator.updateOne(
      { username },
      {
        passwordHash: candidateHash,
        email,
        firstName,
        surname,
        phoneNumber,
        name: displayName,
        address: safeAddress,
      },
    )
    res.status(200).json({ ok: true })
    return
  }

  await Creator.create({
    username,
    passwordHash: candidateHash,
    email,
    firstName,
    surname,
    phoneNumber,
    name: displayName,
    address: safeAddress,
  })

  res.status(201).json({ ok: true })
})

