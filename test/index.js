'use strict'

const { test } = require('ava')
const Ajv = require('ajv')
const fs = require('fs')
const path = require('path')
const docgen = require('react-docgen')
const docgenToJSONSchema = require('..')

const fixtures = path.join(__dirname, 'fixtures')

fs.readdirSync(fixtures)
  .filter((filename) => {
    return /\.(js|ts)$/.test(filename)
  })
  .forEach((filename) => {
    const inputPath = path.join(fixtures, filename)
    test(`${filename}`, (t) => {
      const input = fs.readFileSync(inputPath, 'utf8')
      const docs = docgen.parse(input)
      const schema = docgenToJSONSchema(docs)
      console.log(JSON.stringify(schema, null, 2))

      // ensure resulting schema is a valid JSON Schema
      const ajv = new Ajv()
      ajv.compile(schema)

      t.snapshot(schema)
    })
  })
