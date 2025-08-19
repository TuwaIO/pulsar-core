import { VideoPlayer } from '@/components/VideoPlayer';

export function VideoPreview() {
  return (
    <VideoPlayer
      controls={false}
      autoplay={true}
      loop={false}
      muted={true}
      src="https://github.com/TuwaIO/workflows/raw/refs/heads/main/preview/tuwa_preview.mp4"
    />
  );
}
