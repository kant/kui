/*
 * Copyright 2017-18 IBM Corporation
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

const isDev = false// require('electron-is-dev');
const path = require('path')
const productName = require(path.join(__dirname, '../config.json'))['productName']

interface IMenuItem {
  label?: string
  click?: () => void
  accelerator?: string
  type?: string
  role?: string,
  submenu?: Array<IMenuItem>
}

/**
 * Tell the renderer to execute a command
 *
 */
const tellRendererToExecute = (command: string) => {
  const { webContents } = require('electron')
  webContents.getFocusedWebContents().send('/repl/pexec', { command })
}

/**
 * tell the current window to open a new tab
 *
 */
const newTab = () => tellRendererToExecute('tab new')

/**
 * tell the current window to close the current tab
 *
 */
const closeTab = () => tellRendererToExecute('tab close')

export const install = (app, Menu, createWindow) => {
  if (!isDev) {
    const fileMenuItems: Array<IMenuItem> = [
      { label: 'New Window',
        click: () => createWindow(),
        accelerator: 'CommandOrControl+N'
      },
      { label: 'New Tab',
        click: () => newTab(),
        accelerator: 'CommandOrControl+T'
      },
      { type: 'separator' },
      { label: 'Close Tab',
        click: () => closeTab(),
        accelerator: 'CommandOrControl+W'
      },
      { role: 'close' }
    ]
    if (process.platform !== 'darwin') {
      fileMenuItems.push({ type: 'separator' })
      fileMenuItems.push({ role: 'quit' })
    }

    const helpMenuItems: Array<IMenuItem> = [
      {
        label: 'Getting Started with Composer',
        click: () => {
          try {
            const { webContents } = require('electron')
            webContents.getFocusedWebContents().send('/repl/pexec', { command: 'getting started' })
          } catch (err) {
            console.log(err)
          }
        }
      },
      {
        label: 'Composer Coding 101',
        click: () => {
          try {
            const { webContents } = require('electron')
            webContents.getFocusedWebContents().send('/repl/pexec', { command: 'coding basics' })
          } catch (err) {
            console.log(err)
          }
        }
      },
      {
        label: 'Combinator Reference Guide',
        click: () => {
          try {
            const { webContents } = require('electron')
            webContents.getFocusedWebContents().send('/repl/pexec', { command: 'combinators' })
          } catch (err) {
            console.log(err)
          }
        }
      },
      {
        label: 'Interactive Tutorials',
        click: () => {
          try {
            const { webContents } = require('electron')
            webContents.getFocusedWebContents().send('/repl/pexec', { command: 'tutorials' })
          } catch (err) {
            console.log(err)
          }
        }
      },
      { type: 'separator' },
      {
        label: 'Report Issue...',
        click () { require('electron').shell.openExternal('https://github.com/IBM/kui/issues/new') }
      }
    ]

    const menuTemplate: Array<IMenuItem> = [
      {
        label: 'File',
        submenu: fileMenuItems
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'pasteandmatchstyle' },
          { role: 'delete' },
          { role: 'selectall' }
        ]
      },

      {
        label: 'View',
        submenu: [
          { accelerator: process.platform === 'darwin' ? 'Meta+R' : 'Shift+CmdOrCtrl+R', role: 'reload' },
//          { role: 'forcereload' },
          { role: 'toggledevtools' },
          { type: 'separator' },
          { role: 'resetzoom' },
          { role: 'zoomin' },
          { role: 'zoomout' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      },

      {
        role: 'window',
        submenu: [
          { role: 'minimize' },
          { role: 'close' }
        ]
      },

      {
        role: 'help',
        submenu: helpMenuItems
      }
    ]

    const about: IMenuItem = { label: `About ${productName}`,
      click: () => {
        try {
          require('./plugins/welcome/about')()
        } catch (err) {
          console.log(err)
        }
      }
    }

    if (process.platform === 'darwin') {
      menuTemplate.unshift({
        label: productName,
        submenu: [
          about,
          { type: 'separator' },
          { role: 'services', submenu: [] },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideothers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      })
    } else {
      // for windows and linux, put About in the Help menu
      helpMenuItems.push({ type: 'separator' })
      helpMenuItems.push(about)
    }

    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)
  }
}
