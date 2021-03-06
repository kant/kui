/*
 * Copyright 2017 IBM Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * tests that create an action and test that it shows up in the list UI
 *    this test also covers toggling the sidecar
 */

import { ISuite } from '../../../../../../../../tests/lib/common'
import * as common from '../../../../../../../../tests/lib/common' // tslint:disable-line:no-duplicate-imports
import * as ui from '../../../../../../../../tests/lib/ui'
const { cli, selectors, sidecar } = ui

describe('Create a sequence, then list it', function (this: ISuite) {
  before(common.before(this))
  after(common.after(this))

  it('should have an active repl', () => cli.waitForRepl(this.app))

  // create an action, using the implicit entity type
  it('should create an action', () => cli.do(`create foo ./data/openwhisk/foo.js`, this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo')))

  // create the second action
  it('should create an action', () => cli.do(`create foo2 ./data/openwhisk/foo2.js`, this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('foo2')))

  // create a sequence
  it('should create a sequence', () => cli.do(`create sss1 --sequence foo,foo2`, this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('sss1')))

  // create a sequence
  it('should create a sequence, alternate --sequence order', () => cli.do(`create sss2 foo,foo2 --sequence`, this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('sss2')))

  // create a sequence
  it('should create a sequence, another alternate --sequence order', () => cli.do(`create --sequence sss3 foo,foo2`, this.app)
    .then(cli.expectJustOK)
    .then(sidecar.expectOpen)
    .then(sidecar.expectShowing('sss3')))

  // list tests
  it(`should find foo with "list"`, () => cli.do('list', this.app).then(cli.expectOKWith('foo')))
  it(`should find foo2 "action list"`, () => cli.do(`action list`, this.app).then(cli.expectOKWith('foo2')))
  it(`should find sss1 with "action list"`, () => cli.do(`action list`, this.app).then(cli.expectOKWith('sss1')))
  it(`should find sss2 with "list"`, () => cli.do(`list`, this.app).then(cli.expectOKWith('sss2')))
  it(`should find sss3 with "action list"`, () => cli.do(`action list`, this.app).then(cli.expectOKWith('sss3')))

  // click on a sequence component bubble
  it('should show action after clicking on bubble', () => this.app.client.click(ui.selectors.SIDECAR_SEQUENCE_CANVAS_NODE_N(0))
    .then(() => sidecar.expectOpen(this.app))
    .then(sidecar.expectShowing('foo')))
})
