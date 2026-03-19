import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'subscribers.json')

export interface Subscriber {
  email: string
  createdAt: string
  confirmed: boolean
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  if (!fs.existsSync(SUBSCRIBERS_FILE)) {
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify([]))
  }
}

export function getSubscribers(): Subscriber[] {
  ensureDataDir()
  try {
    const data = fs.readFileSync(SUBSCRIBERS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export function addSubscriber(email: string): { success: boolean; message: string } {
  ensureDataDir()
  const subscribers = getSubscribers()
  const normalizedEmail = email.toLowerCase().trim()

  if (subscribers.find(s => s.email === normalizedEmail)) {
    return { success: false, message: 'This email is already subscribed.' }
  }

  subscribers.push({
    email: normalizedEmail,
    createdAt: new Date().toISOString(),
    confirmed: true,
  })

  fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2))
  return { success: true, message: 'Successfully subscribed!' }
}
