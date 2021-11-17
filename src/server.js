import { createServer, Model, Factory } from 'miragejs';
import moment from 'moment';

const count = 50;
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min) + min);
const extendSales = () => {
  const currentPeriod = [];
  const comparePeriod = [];

  for (let i = 0; i < count; i++) {
    currentPeriod.push({
      date: moment().add(i, 'days').format(),
      visits: getRandomInt(1000, 10000)
    });
  }

  for (let i = 0; i < count; i++) {
    comparePeriod.push({
      date: moment().add(i, 'days').format(),
      visits: getRandomInt(600, 6000)
    });
  }

  // Set conversion to 3% - 5%.
  const dataPointsCurrentPeriod = [...currentPeriod].map((day) => ({
    ...day,
    transactions: Math.floor(day.visits * (getRandomInt(3, 5) / 100))
  }));

  const dataPointsComparePeriod = [...comparePeriod].map((day) => ({
    ...day,
    transactions: Math.floor(day.visits * (getRandomInt(3, 5) / 100))
  }));

  return {
    date(i) {
      return dataPointsCurrentPeriod[i].date
    },
    current_period(i) {
      return {
        visits: dataPointsCurrentPeriod[i].visits,
        transactions: dataPointsCurrentPeriod[i].transactions
      }
    },
    compare_period(i) {
      return {
        visits: dataPointsComparePeriod[i].visits,
        transactions: dataPointsComparePeriod[i].transactions
      }
    }
  }
}

const server = ({environment = 'development'}) => {
  return createServer({
    environment,
    models: {
      sale: Model
    },
    factories: {
      sale: Factory.extend(extendSales()),
    },
    seeds(server) {
      server.createList('sale', count);
    },
    routes() {
      this.namespace = 'api';

      this.get('/sales', (schema) => {
        return schema.sales.all().models;
      }, {
        timing: 2000
      });
    }
  })
};

export { server as default };