// Manual Jest mock for @vercel/analytics/react
// Exports a no-op `Analytics` component so tests don't require the real package.
const React = require('react');
module.exports = {
  Analytics: function Analytics() {
    return React.createElement('div', null);
  }
};
