import { VideoPlayer } from '@/components/VideoPlayer';

export function VideoPreview() {
  return <VideoPlayer controls={false} autoplay={true} loop={false} muted={true} src="/tuwa_preview.mp4" />;
}
