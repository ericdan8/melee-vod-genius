import axios from 'axios';

var API_KEY = 'AIzaSyBCMsrp4NvirYxJWOgPKuaWRSpw3Rg15eg';
var API_ENDPOINT = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&id=';


var YouTubeDataHelper = {
  getVideoDataById: async function(id) {
    return new Promise((resolve, reject) => {
      axios.get(this._getUrl(id))
        .then(res => resolve(res.data.items[0]))
        .catch((err) => {console.error(err);});
    });
  },
  _getUrl: function(id) {
    return API_ENDPOINT + id + '&key=' + API_KEY;
  }
};

export default YouTubeDataHelper;
