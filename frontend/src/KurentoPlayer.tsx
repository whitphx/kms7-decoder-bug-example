import React, { useState, useEffect, useCallback, useRef } from 'react';
import KurentoClient from 'kurento-client';
import * as KurentoUtils from 'kurento-utils';

declare module 'kurento-client' {
  interface ClientInstance {
    create(
      type: 'PlayerEndpoint',
      options?: {
        networkCache?: number;
        uri: string;
        useEncodedMedia?: boolean;
      }
    ): Promise<PlayerEndpoint>;
  }

  interface PlayerEndpoint extends MediaElement {
    mediaPipeline: MediaPipeline;
    networkCache?: number;
    uri: string;
    useEncodedMedia?: boolean;

    play(callback?: (error: Error) => void): Promise<void>;
    pause(
      callback?: (error: Error, result: UriEndpointState) => void
    ): Promise<UriEndpointState>;
    stop(
      callback?: (error: Error, result: UriEndpointState) => void
    ): Promise<UriEndpointState>;

    on(eventName: 'EndOfStream', callback: (event: {}) => void): PlayerEndpoint;
  }

  interface WebRtcEndpoint extends MediaElement {
    on(
      event: 'IceCandidateFound',
      callback: (event: IceCandidate) => void
    ): WebRtcEndpoint;
  }

  type UriEndpointState = 'STOP' | 'START' | 'PAUSE'; // https://github.com/Kurento/kurento-client-core-js/blob/2160f8e6938f138b52b72a5c5c354d1e5fce1ca0/lib/complexTypes/UriEndpointState.js
}

interface KurentoPlayerProps {
  wsUri: string;
  videoUri: string;
}

const KurentoPlayer: React.FC<KurentoPlayerProps> = (props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [kurentoClient, setKurentoClient] = useState<
    KurentoClient.ClientInstance
  >();
  useEffect(() => {
    KurentoClient(props.wsUri)
      .then(setKurentoClient)
      .catch((error) => {
        console.log('Failed to get kurentoClient', error);
      });
  }, [props.wsUri]);

  const [webRtcPeer, setWebRtcPeer] = useState<KurentoUtils.WebRtcPeer>();
  const [pipeline, setPipeline] = useState<KurentoClient.MediaPipeline>();
  const [playerEp, setPlayerEp] = useState<KurentoClient.PlayerEndpoint>();

  const stop = useCallback(() => {
    if (webRtcPeer) {
      webRtcPeer.dispose();
      setWebRtcPeer(undefined);
    }
    if (playerEp) {
      playerEp.stop();
      setPlayerEp(undefined);
    }
    if (pipeline) {
      pipeline.release();
      setPipeline(undefined);
    }
  }, [webRtcPeer, playerEp, pipeline]);

  const onError = useCallback((error) => {
    if (error) {
      console.trace();
      console.log(error);
      stop();
    }
  }, [stop]);

  const start = useCallback(() => {
    if (!kurentoClient) {
      return;
    }
    if (!videoRef.current) {
      return;
    }

    const webRtcPeerOpts = {
      remoteVideo: videoRef.current,
    };

    const webRtcPeer = KurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(webRtcPeerOpts, (error) => {
      if (error) {
        onError(error);
      }

      webRtcPeer.generateOffer((error, sdpOffer) => {
        if (error) {
          onError(error);
        }

        kurentoClient.create('MediaPipeline')
        .then((pipeline) => {
          setPipeline(pipeline);

          return Promise.all([
            pipeline.create('PlayerEndpoint', { uri: props.videoUri }),
            pipeline.create('WebRtcEndpoint'),
          ])
        })
        .then(([playerEp, webRtcEp]) => {
          // Connect WebRTC
          webRtcPeer.on('icecandidate', (candidate) => {
            console.log('Local candidate:', candidate);
            candidate = KurentoClient.getComplexType('IceCandidate')(
              candidate
            );
            webRtcEp.addIceCandidate(candidate, onError);
          });
          webRtcEp.on('IceCandidateFound', (event) => {
            const candidate = event.candidate;
            console.log('Remote candidate:', candidate);
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            webRtcPeer.addIceCandidate(candidate, onError);
          });

          webRtcEp.processOffer(sdpOffer).then((sdpAnswer) => {
            webRtcPeer.processAnswer(sdpAnswer);
          });

          webRtcEp.gatherCandidates();

          playerEp.connect(webRtcEp);

          playerEp.play();

          setPlayerEp(playerEp);
        });
      })
    });
    setWebRtcPeer(webRtcPeer);

  }, [kurentoClient, onError, props.videoUri]);

  if (kurentoClient == null) {
    return <p>Connecting...</p>
  }

  return (
    <div>
      <video ref={videoRef} autoPlay />
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}

export default React.memo(KurentoPlayer);
