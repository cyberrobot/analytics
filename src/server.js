import { createServer, Model, Factory } from 'miragejs';
import moment from 'moment';

const count = 100;
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min) + min);
const extendConversion = () => {
  const visits = [];

  for (let i = 0; i < count; i++) {
    visits.push({
      date: moment().add(i, 'days').format(),
      visits: getRandomInt(1000, 10000)
    });
  }
  // Set conversion to 3% - 5%.
  const dataPoints = [...visits].map((day) => ({
    ...day,
    transactions: Math.floor(day.visits * (getRandomInt(3, 5) / 100))
  }));

  return {
    date(i) {
      return dataPoints[i].date
    },
    visits(i) {
      return dataPoints[i].visits;
    },
    transactions(i) {
      return dataPoints[i].transactions;
    }
  }
}

const server = ({environment = 'development'}) => {
  return createServer({
    environment,
    models: {
      conversion: Model
    },
    factories: {
      conversion: Factory.extend(extendConversion()),
    },
    seeds(server) {
      server.createList('conversion', count);
    },
    routes() {
      this.namespace = 'api';

      this.get('/conversion', (schema) => {
        return schema.conversions.all().models;
      }, {
        timing: 2000
      });
    }
  })
};

export { server as default };