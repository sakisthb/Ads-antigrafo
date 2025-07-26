import { describe, it, expect } from 'vitest'
import { cn } from '../utils'

describe('Utils', () => {
  describe('cn function', () => {
    it('combines class names correctly', () => {
      const result = cn('class1', 'class2')
      expect(result).toContain('class1')
      expect(result).toContain('class2')
    })

    it('handles conditional classes', () => {
      const result = cn('base-class', true && 'conditional-class', false && 'hidden-class')
      expect(result).toContain('base-class')
      expect(result).toContain('conditional-class')
      expect(result).not.toContain('hidden-class')
    })

    it('handles undefined and null values', () => {
      const result = cn('base-class', undefined, null, 'another-class')
      expect(result).toContain('base-class')
      expect(result).toContain('another-class')
    })

    it('handles empty input', () => {
      const result = cn()
      expect(result).toBeDefined()
    })

    it('removes duplicate classes', () => {
      const result = cn('duplicate', 'other', 'duplicate')
      // Should not contain duplicate classes
      const classArray = result.split(' ')
      const duplicateCount = classArray.filter(cls => cls === 'duplicate').length
      expect(duplicateCount).toBeLessThanOrEqual(1)
    })
  })
})