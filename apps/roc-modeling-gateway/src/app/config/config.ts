const _port_gateway_service: number = 2000;
const localService: string = `http://localhost:${_port_gateway_service}/graphql`;
const rocCalculatorService: string = `http://3.23.101.198/`;

export const CONFIG =
{
  APP:
  {
    PORTS:
    {
      GATEWAY: _port_gateway_service
    },
    ENVIRONMENTS:
    {
      LOCAL: 'LOCAL',
      DEV: 'DEV',
      STAGING: 'STAGING',
      PROD: 'PROD'
    }
  },
  //NODE_ENV=LOCAL|DEV|STAGING|PROD
  SERVER_LIST:
  {
    LOCAL:
    {
      HEALTH_CHECK: `http://localhost:${_port_gateway_service}/healthcheck`,
      ROC: localService,
      ROC_CALCULATOR: rocCalculatorService,
      DATASTOP_IO_INSTITUTIONS: 'https://dev-api.datastop.io/institutions/graphql',
      DATASTOP_IO_LOCATIONS: 'https://dev-api.datastop.io/locations/graphql',
      DATASTOP_IO_OCCUPATIONS: 'https://dev-api.datastop.io/occupations/graphql'
    },
    DEV:
    {
      HEALTH_CHECK: 'http://api-returnon-college-development.us-east-2.elasticbeanstalk.com/healthcheck',
      ROC: localService,
      ROC_CALCULATOR: rocCalculatorService,
      DATASTOP_IO_INSTITUTIONS: 'https://dev-api.datastop.io/institutions/graphql',
      DATASTOP_IO_LOCATIONS: 'https://dev-api.datastop.io/locations/graphql',
      DATASTOP_IO_OCCUPATIONS: 'https://dev-api.datastop.io/occupations/graphql'
    },
    STAGING:
    {
      HEALTH_CHECK: 'http://api-returnon-college-staging.us-east-2.elasticbeanstalk.com/healthcheck',
      ROC: localService,
      ROC_CALCULATOR: rocCalculatorService,
      DATASTOP_IO_INSTITUTIONS: 'https://staging-api.datastop.io/institutions/graphql',
      DATASTOP_IO_LOCATIONS: 'https://staging-api.datastop.io/locations/graphql',
      DATASTOP_IO_OCCUPATIONS: 'https://staging-api.datastop.io/occupations/graphql'
    },
    PROD:
    {
      HEALTH_CHECK: 'http://api-returnon-college-production.us-east-2.elasticbeanstalk.com/healthcheck',
      ROC: localService,
      ROC_CALCULATOR: rocCalculatorService,
      DATASTOP_IO_INSTITUTIONS: 'https://api.datastop.io/institutions/graphql',
      DATASTOP_IO_LOCATIONS: 'https://api.datastop.io/locations/graphql',
      DATASTOP_IO_OCCUPATIONS: 'https://api.datastop.io/occupations/graphql'
    }
  }
};
