import { onSettled } from 'solid-js';

export default function BackgroundVideo(props: { src?: string; class?: string }) {
  let video!: HTMLVideoElement;

  onSettled(() => {
    const updatePlayback = () => {
      if (document.hidden) {
        video.pause();
        return;
      }
      video.muted = true;
      if (video.networkState === HTMLMediaElement.NETWORK_EMPTY) video.load();
      void video.play().catch(() => {});
    };
    document.addEventListener('visibilitychange', updatePlayback);
    window.addEventListener('pageshow', updatePlayback);
    updatePlayback();
    return () => {
      document.removeEventListener('visibilitychange', updatePlayback);
      window.removeEventListener('pageshow', updatePlayback);
      video.pause();
    };
  });

  return <video ref={video} src={props.src} class={props.class} autoplay muted loop playsinline />;
}
