import React, { useEffect, useState } from 'react';
import KurentoPlayer from './KurentoPlayer';

const defaultWsProtocol =
  window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const defaultKurentoWsUri = `${defaultWsProtocol}//${window.location.host}/kurento`;

const useKurentoWsUri = (): string => {
  const [wsUri, setWsUri] = useState(defaultKurentoWsUri);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    setWsUri(query.get('ws_uri') || defaultKurentoWsUri);
  }, []);

  return wsUri;
};

function App() {
  const wsUri = useKurentoWsUri();
  const [videoUri, setVideoUri] = useState('');

  return (
    <div>
      <label>
        Video URI
        <input type="text" value={videoUri} onChange={e => setVideoUri(e.target.value)} />
      </label>
      <KurentoPlayer wsUri={wsUri} videoUri={videoUri} />
    </div>
  );
}

export default App;
