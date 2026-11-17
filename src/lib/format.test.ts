import { test } from 'node:test'
import assert from 'node:assert/strict'
import { euros, quantity } from './format.ts'

test('euros', () => {
  assert.equal(euros(750), '7,50 €')
  assert.equal(euros(0), '0,00 €')
  assert.equal(euros(7250), '72,50 €')
  assert.equal(euros(5), '0,05 €')
  assert.equal(euros(100000), '1 000,00 €')
  assert.equal(euros(-900), '-9,00 €')
})

test('quantity', () => {
  assert.equal(quantity(2, 'Soupe'), '2 × Soupe')
})
