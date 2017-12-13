import axios from 'axios';
import YouTube from '../../../../Library/Caches/typescript/2.6/node_modules/@types/react-youtube';

var API_KEY = 'AIzaSyBCMsrp4NvirYxJWOgPKuaWRSpw3Rg15eg';
var API_ENDPOINT = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&id=';


export default class YouTubeHelper {
  getVideoDataById(id) {
    
  }
  _getUrl(id) {
    return API_ENDPOINT + id + '&key=' + API_KEY;
  }
};
