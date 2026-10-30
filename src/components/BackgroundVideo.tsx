import { onSettled } from 'solid-js';
import { dynamic } from '@solidjs/web';

export default function BackgroundVideo(props: { src?: string; class?: string }) {
  const Video = dynamic(() => "video");
  let video!: HTMLVideoElement;

  onSettled(() => {
    const updatePlayback = () => {
      if (document.hidden) return video.pause();
      video.muted = true;
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

  return (
    <Video
      ref={(element: HTMLVideoElement) => { video = element; }}
      src={props.src} class={props.class}
      autoplay muted loop playsinline
    />
  );
}
