import inquirer from 'inquirer'
import format from 'chalk'

import { echo, p, warning, error } from '../utils/print-tools'

export default class HostingDelete {
  constructor (context) {
    this.context = context
    this.session = context.session
    this.Hosting = context.Hosting
  }

  static getQuestions (hostingName) {
    const questions = [
      {
        type: 'confirm',
        name: 'delete',
        message: p(2)(`Are you sure you want to remove: ${format.red(hostingName)}`),
        default: false
      }
    ]

    return questions
  }

  async run ([hostingName, cmd]) {
    this.cmd = cmd
    const resp = await inquirer.prompt(HostingDelete.getQuestions(hostingName))
    if (!resp.delete) {
      echo()
      process.exit(0)
    }

    const hosting = await this.Hosting.get(hostingName)
    if (!hosting.existLocally) {
      warning(p(4)(`Couldn't find any hosting named ${format.cyan(hostingName)}!`))
      echo()
      process.exit(1)
    }

    try {
      const deletedHosting = await hosting.delete()
      echo(4)(`Hosting ${format.cyan(deletedHosting.name)} has been ${format.green('successfully')} deleted!`)
      echo()
    } catch (err) {
      error('Deleting hosting failed!')
    }
  }
}
