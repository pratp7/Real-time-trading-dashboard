import { describe, expect, it } from 'vitest'

import { AlertsService } from '../../services/alertsService'

describe('AlertsService', () => {
  it('creates alerts per user and lists only current user alerts', () => {
    const service = new AlertsService()

    const alice = service.createAlert({
      symbol: 'btc',
      name: 'Bitcoin',
      targetPrice: 70000,
      condition: 'above',
      userId: 'alice',
    })

    service.createAlert({
      symbol: 'eth',
      name: 'Ethereum',
      targetPrice: 2500,
      condition: 'below',
      userId: 'bob',
    })

    expect(service.listAlerts('alice')).toHaveLength(1)
    expect(service.listAlerts('alice')[0].id).toBe(alice.id)
    expect(service.listAlerts('bob')).toHaveLength(1)
  })

  it('toggles and deletes alert by id', () => {
    const service = new AlertsService()

    const alert = service.createAlert({
      symbol: 'sol',
      name: 'Solana',
      targetPrice: 200,
      condition: 'above',
      userId: 'alice',
    })

    const toggled = service.toggleAlert('alice', alert.id, false)
    expect(toggled?.isActive).toBe(false)

    const deleted = service.deleteAlert('alice', alert.id)
    expect(deleted).toBe(true)
    expect(service.listAlerts('alice')).toHaveLength(0)
  })
})
