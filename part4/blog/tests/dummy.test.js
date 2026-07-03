const { test, describe } = require('node:test')
const assert = require('node:assert')

const dummy = require('../utils/list_helper').dummy

test('dummy returns one', () => {
    const posts = []

    const result = dummy(posts)
    assert.strictEqual(result, 1)
})