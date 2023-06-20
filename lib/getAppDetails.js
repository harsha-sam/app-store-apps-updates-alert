const axios = require('axios');

const getAppDetails = async (appId) => {
  try {
    const res = await axios.get(`https://itunes.apple.com/lookup?id=${appId}`);
    const data = res.data;
    if (data.resultCount === 1) {
      const { trackName: name, version } = data.results[0];
      return {
        name,
        version,
      };
    }
  } catch (err) {
  }
};

module.exports = getAppDetails;
