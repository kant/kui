/*
 * Copyright 2018 IBM Corporation
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
import { appGet } from '../../utility/usage'
import * as repl from '../../../../../../../build/core/repl'
import * as view from '../../view/entity-view'
import * as parseUtil from '../../utility/parse'
import * as Debug from 'debug'
const debug = Debug('plugins/apache-composer/cmd/app-get')

export default async (commandTree, prequire) => {
  const wsk = await prequire('openwhisk')

  /* command handler for app get */
  commandTree.listen(`/wsk/app/get`, ({ argvNoOptions, execOptions, parsedOptions }) =>
    repl.qexec(`wsk action get "${parseUtil.parseName(argvNoOptions, 'get')}"`, undefined, undefined,
      Object.assign({}, execOptions, { override: true, originalOptions: parsedOptions }))
  , { usage: appGet('get') })

    // override wsk action get
  const actionGet = (await (commandTree.find('/wsk/action/get'))).$

  wsk.synonyms('actions').forEach(syn => {
    commandTree.listen(`/wsk/${syn}/get`, (opts) => {
      if (!actionGet) {
        return Promise.reject(new Error())
      }
      debug('rendering action get')
      return actionGet(opts).then(async response => view.visualizeComposition(response, opts.execOptions))
    })
  })

}
