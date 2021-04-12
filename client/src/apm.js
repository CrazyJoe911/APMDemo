import { init as initApm } from '@elastic/apm-rum'

const apm = initApm({

  // Set required service name (allowed characters: a-z, A-Z, 0-9, -, _, and space)
  serviceName: 'APMDemo',

  // Set custom APM Server URL (default: http://localhost:8200)
  serverUrl: 'https://d89e959ea7f84303a32f40699916662c.apm.us-west1.gcp.cloud.es.io:443',

  // Set service version (required for sourcemap feature)
  serviceVersion: '',
  
})

apm.setUserContext({
  id: '008',
  username: 'Jude',
  email: 'Jude@warrior.com'
})

export default apm
