import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  studioHost: 'https://redmalanga.sanity.studio', // Optional: specify your custom studio host
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
