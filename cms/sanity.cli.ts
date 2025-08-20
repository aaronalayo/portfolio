import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  studioHost: 'redmalanga', // Optional: specify your custom studio host
  api: {
    projectId: 'or9vpa2z',
    dataset: 'production',
  },
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  autoUpdates: true,
})
