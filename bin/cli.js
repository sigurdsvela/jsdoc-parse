#!/usr/bin/env node
'use strict'
var parse = require('../')
var commandLineArgs = require('command-line-args')
var cliOptions = require('../lib/cli-options')
var tool = require('command-line-tool')

var cli = commandLineArgs(cliOptions.definitions.concat([
  { name: 'help', alias: 'h', type: Boolean, description: 'Display this usage.' }
]))

try {
  var usage = cli.getUsage(cliOptions.usage)
  var options = cli.parse()
} catch (err) {
  tool.stop(1, { message: err, usage: usage })
}

if (options.help) {
  tool.stop(0, { usage: usage })
}

var parseStream = parse(options)
  .on('error', function (err) {
    tool.stop(1, { message: err })
  })
parseStream.pipe(process.stdout)

if (!options.src) process.stdin.pipe(parseStream)
