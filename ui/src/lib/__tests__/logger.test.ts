import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { logger, LogLevel, log } from '../logger'

// Mock console methods
const mockConsole = {
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}

describe('Logger Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock console methods
    global.console = { ...global.console, ...mockConsole }
    
    // Reset logger state
    logger.setMinLevel(LogLevel.DEBUG)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Basic Logging', () => {
    it('logs debug messages when level is DEBUG', () => {
      logger.debug('Debug message', { component: 'TestComponent' })
      expect(mockConsole.debug).toHaveBeenCalledTimes(1)
      expect(mockConsole.debug).toHaveBeenCalledWith(
        expect.stringContaining('DEBUG'),
        expect.objectContaining({ component: 'TestComponent' })
      )
    })

    it('logs info messages', () => {
      logger.info('Info message', { action: 'test' })
      expect(mockConsole.info).toHaveBeenCalledTimes(1)
      expect(mockConsole.info).toHaveBeenCalledWith(
        expect.stringContaining('INFO'),
        expect.objectContaining({ action: 'test' })
      )
    })

    it('logs warning messages', () => {
      logger.warn('Warning message')
      expect(mockConsole.warn).toHaveBeenCalledTimes(1)
      expect(mockConsole.warn).toHaveBeenCalledWith(
        expect.stringContaining('WARN'),
        expect.any(Object)
      )
    })

    it('logs error messages with error object', () => {
      const error = new Error('Test error')
      logger.error('Error message', error, { component: 'TestComponent' })
      
      expect(mockConsole.error).toHaveBeenCalledTimes(1)
      expect(mockConsole.error).toHaveBeenCalledWith(
        expect.stringContaining('ERROR'),
        expect.objectContaining({ component: 'TestComponent' }),
        error
      )
    })

    it('logs critical messages', () => {
      const error = new Error('Critical error')
      logger.critical('Critical message', error)
      
      expect(mockConsole.error).toHaveBeenCalledTimes(1)
      expect(mockConsole.error).toHaveBeenCalledWith(
        expect.stringContaining('CRITICAL'),
        expect.any(Object),
        error
      )
    })
  })

  describe('Log Level Filtering', () => {
    it('respects minimum log level', () => {
      logger.setMinLevel(LogLevel.WARN)
      
      logger.debug('Debug message')
      logger.info('Info message')
      logger.warn('Warning message')
      logger.error('Error message')
      
      expect(mockConsole.debug).not.toHaveBeenCalled()
      expect(mockConsole.info).not.toHaveBeenCalled()
      expect(mockConsole.warn).toHaveBeenCalledTimes(1)
      expect(mockConsole.error).toHaveBeenCalledTimes(1)
    })

    it('always logs critical messages regardless of level', () => {
      logger.setMinLevel(LogLevel.ERROR)
      logger.critical('Critical message')
      expect(mockConsole.error).toHaveBeenCalledTimes(1)
    })
  })

  describe('Context Handling', () => {
    it('merges context correctly', () => {
      const componentLogger = logger.withContext({ component: 'TestComponent' })
      componentLogger.info('Test message', { action: 'test' })
      
      expect(mockConsole.info).toHaveBeenCalledWith(
        expect.stringContaining('[TestComponent]'),
        expect.objectContaining({
          component: 'TestComponent',
          action: 'test'
        })
      )
    })

    it('formats message with component and action', () => {
      logger.info('Test message', { component: 'TestComponent', action: 'testAction' })
      
      expect(mockConsole.info).toHaveBeenCalledWith(
        expect.stringMatching(/\[TestComponent\]\(testAction\)/),
        expect.any(Object)
      )
    })
  })

  describe('Performance Timing', () => {
    it('measures execution time', () => {
      const timer = logger.startTimer('test-operation')
      
      // Simulate some work
      setTimeout(() => {
        timer()
        expect(mockConsole.info).toHaveBeenCalledWith(
          expect.stringContaining('Timer completed: test-operation'),
          expect.objectContaining({
            action: 'performance_timer',
            duration: expect.any(Number)
          })
        )
      }, 100)
    })
  })

  describe('API Logging Helpers', () => {
    it('logs API requests', () => {
      logger.logApiRequest('/api/campaigns', 'GET', { userId: '123' })
      
      expect(mockConsole.info).toHaveBeenCalledWith(
        expect.stringContaining('API Request: GET /api/campaigns'),
        expect.objectContaining({
          action: 'api_request',
          url: '/api/campaigns',
          method: 'GET',
          userId: '123'
        })
      )
    })

    it('logs successful API responses', () => {
      logger.logApiResponse('/api/campaigns', 200, 150)
      
      expect(mockConsole.info).toHaveBeenCalledWith(
        expect.stringContaining('API Response: 200 /api/campaigns (150ms)'),
        expect.objectContaining({
          action: 'api_response',
          status: 200,
          duration: 150
        })
      )
    })

    it('logs failed API responses as errors', () => {
      logger.logApiResponse('/api/campaigns', 500, 250)
      
      expect(mockConsole.error).toHaveBeenCalledWith(
        expect.stringContaining('API Response: 500 /api/campaigns (250ms)'),
        expect.objectContaining({
          action: 'api_response',
          status: 500,
          duration: 250
        }),
        undefined
      )
    })
  })

  describe('User Action Logging', () => {
    it('logs user actions', () => {
      logger.logUserAction('button_click', { button: 'export' })
      
      expect(mockConsole.info).toHaveBeenCalledWith(
        expect.stringContaining('User Action: button_click'),
        expect.objectContaining({
          action: 'user_interaction',
          button: 'export'
        })
      )
    })
  })

  describe('Campaign Event Logging', () => {
    it('logs campaign events', () => {
      logger.logCampaignEvent('created', 'campaign-123', { adAccountId: 'account-456' })
      
      expect(mockConsole.info).toHaveBeenCalledWith(
        expect.stringContaining('Campaign Event: created'),
        expect.objectContaining({
          campaignId: 'campaign-123',
          action: 'campaign_event',
          adAccountId: 'account-456'
        })
      )
    })
  })

  describe('Log Storage and Retrieval', () => {
    it('stores logs in memory', () => {
      logger.info('Test message 1')
      logger.info('Test message 2')
      
      const recentLogs = logger.getRecentLogs(10)
      expect(recentLogs).toHaveLength(2)
      expect(recentLogs[0].message).toBe('Test message 1')
      expect(recentLogs[1].message).toBe('Test message 2')
    })

    it('limits stored logs to maximum', () => {
      // Simulate many logs
      for (let i = 0; i < 1100; i++) {
        logger.info(`Message ${i}`)
      }
      
      const recentLogs = logger.getRecentLogs(1100)
      expect(recentLogs.length).toBeLessThanOrEqual(1000)
    })

    it('exports logs as JSON', () => {
      logger.info('Test message')
      const exported = logger.exportLogs()
      
      expect(() => JSON.parse(exported)).not.toThrow()
      const logs = JSON.parse(exported)
      expect(Array.isArray(logs)).toBe(true)
      expect(logs[0]).toHaveProperty('message', 'Test message')
    })
  })

  describe('Convenience Functions', () => {
    it('provides log shorthand functions', () => {
      log.info('Test message')
      log.error('Error message', new Error('test'))
      log.userAction('test_action')
      
      expect(mockConsole.info).toHaveBeenCalledTimes(1)
      expect(mockConsole.error).toHaveBeenCalledTimes(1)
    })

    it('provides withContext shorthand', () => {
      const contextLogger = log.withContext({ component: 'TestComponent' })
      contextLogger.info('Test message')
      
      expect(mockConsole.info).toHaveBeenCalledWith(
        expect.stringContaining('[TestComponent]'),
        expect.any(Object)
      )
    })
  })
})