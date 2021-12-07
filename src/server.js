import { createServer, Model, Factory } from 'miragejs';
import moment from 'moment';

// Change this value to set date range limit and the number of data points
const count = 50;
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min) + min);
const extendSales = () => {
  const currentPeriod = [];

  for (let i = 0; i < count; i++) {
    currentPeriod.push({
      date: moment().add(i, 'days').format(),
      visits: getRandomInt(1000, 10000)
    });
  }

  // Set conversion to 3% - 5% and price per item to 100.
  const dataPointsCurrentPeriod = [...currentPeriod].map((day) => {
    const unitPrice = getRandomInt(50, 300);
    return {
      ...day,
      revenue: Math.floor(day.visits * (getRandomInt(3, 5) / 100) * unitPrice)
    };
  });

  return {
    date(i) {
      return dataPointsCurrentPeriod[i].date
    },
    current_period(i) {
      return {
        visits: dataPointsCurrentPeriod[i].visits,
        revenue: dataPointsCurrentPeriod[i].revenue
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