
import { useState } from "react";
import { Play, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MediaAttachment {
  url: string;
  type: 'image' | 'video';
}

interface ReviewMediaGalleryProps {
  mediaAttachments: MediaAttachment[];
}

const ReviewMediaGallery = ({ mediaAttachments }: ReviewMediaGalleryProps) => {
  const [selectedMedia, setSelectedMedia] = useState<MediaAttachment | null>(null);

  if (!mediaAttachments || mediaAttachments.length === 0) {
    return null;
  }

  const openMedia = (media: MediaAttachment) => {
    setSelectedMedia(media);
  };

  const closeMedia = () => {
    setSelectedMedia(null);
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-2 mt-3">
        {mediaAttachments.slice(0, 6).map((media, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => openMedia(media)}
          >
            {media.type === 'image' ? (
              <img
                src={media.url}
                alt={`Review attachment ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center relative">
                <video
                  src={media.url}
                  className="w-full h-full object-cover"
                  muted
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Play className="w-6 h-6 text-white" fill="white" />
                </div>
              </div>
            )}
            
            {/* Media type indicator */}
            <div className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded">
              {media.type === 'image' ? (
                <ImageIcon className="w-3 h-3" />
              ) : (
                <Play className="w-3 h-3" />
              )}
            </div>

            {/* Show count if more than 6 items */}
            {index === 5 && mediaAttachments.length > 6 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-semibold">
                  +{mediaAttachments.length - 6}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Fullscreen overlay */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={closeMedia}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full h-10 w-10 p-0"
          >
            <X className="w-5 h-5" />
          </Button>
          
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            {selectedMedia.type === 'image' ? (
              <img 
                src={selectedMedia.url} 
                alt="Review attachment"
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <video 
                src={selectedMedia.url} 
                controls
                className="max-w-full max-h-full"
                autoPlay
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewMediaGallery;
