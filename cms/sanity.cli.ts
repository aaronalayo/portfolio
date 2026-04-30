import {defineCliConfig} from 'sanity/cli'
export default defineCliConfig({
  studioHost: 'redmalanga',
  api: {
    projectId: 'or9vpa2z',
    dataset: 'production',
  },
  deployment: {
    appId: 'jkz4onfdw77lo6bt1aoxq07r',
    autoUpdates: true,
  },
})