import { test } from 'node:test'
import assert from 'node:assert/strict'
import { errorMessage } from './api.ts'

test('errorMessage reads { error }', () => {
  assert.equal(errorMessage(409, { error: 'Aucune ligne à envoyer' }), 'Aucune ligne à envoyer')
})

test('errorMessage without a sentence: the status', () => {
  assert.equal(errorMessage(500, null), 'Erreur 500')
  assert.equal(errorMessage(502, 'Bad gateway'), 'Erreur 502')
  assert.equal(errorMessage(409, { error: 12 }), 'Erreur 409')
  assert.equal(errorMessage(409, { error: '' }), 'Erreur 409')
})
