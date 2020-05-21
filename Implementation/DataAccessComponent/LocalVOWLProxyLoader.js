import * as $CONST from './DataHandlerConstants';
import SimpleProxyLoader from './SimpleProxyLoader';
export default class LocalVOWLProxyLoader extends SimpleProxyLoader {
  constructor() {
    super();
    this.type = $CONST.TYPE_LOCAL_VOWL_PROXY;
    // set the proxy config here;

    this.iriToConvert = 'http://xmlns.com/foaf/0.1/'; // << example IRI for testing
  }

  /** -------------- Exposed Functions --------------**/
  setIriForConverter = iri => {
    this.iriToConvert = iri;
  };

  /** -------------- INTERNAL FUNCTIONS -------------- **/
  // MUST OVERWRITE
  // _buildDataRequest = () => {
  //   const requestPath = 'java -jar owl2vowl.jar -iri ' + this.iriToConvert + ' -output processedData.json';
  //   return {
  //     requestType: 'systemCall',
  //     fetchCall: requestPath,
  //     postCall: 'readJsonFile'
  //   };
  // };

  // testing function
  // MUST OVERWRITE
  _buildDataRequest = () => {
    const requestPath = 'loadFile';
    return {
      requestType: 'systemCall',
      fetchCall: requestPath,
      postCall: 'none'
    };
  };
}
