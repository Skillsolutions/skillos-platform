"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, PauseCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface VideoGalleryProps {
  videos: {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    videoUrl: string;
  }[];
}

const VideoGallery: React.FC<VideoGalleryProps> = ({ videos }) => {
  const [activeVideo, setActiveVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
  };

  const handleNextVideo = () => {
    setActiveVideo((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
    setIsPlaying(false);
  };

  const handlePrevVideo = () => {
    setActiveVideo((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
    setIsPlaying(false);
  };

  const handleThumbnailClick = (index: number) => {
    setActiveVideo(index);
    setIsPlaying(false);
  };

  return (
    <motion.div 
      className="w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="relative rounded-lg overflow-hidden bg-gray-800 border border-gray-700 shadow-xl">
        {/* Main video player */}
        <div 
          className="relative aspect-video"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 z-10">
              <Button 
                onClick={handleVideoPlay}
                className="rounded-full w-16 h-16 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Play className="h-8 w-8" />
              </Button>
            </div>
          )}
          
          <iframe 
            src={`${videos[activeVideo].videoUrl}${isPlaying ? '?autoplay=1' : ''}`}
            title={videos[activeVideo].title}
            className="absolute top-0 left-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          
          {/* Video controls overlay */}
          {showControls && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent flex items-center justify-between z-20">
              <div className="text-white">
                <h3 className="font-medium">{videos[activeVideo].title}</h3>
              </div>
              <div className="flex items-center space-x-2">
                {isPlaying ? (
                  <Button 
                    onClick={handleVideoPause}
                    size="sm"
                    variant="ghost"
                    className="text-white"
                  >
                    <PauseCircle className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleVideoPlay}
                    size="sm"
                    variant="ghost"
                    className="text-white"
                  >
                    <Play className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Video navigation */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{videos[activeVideo].title}</h2>
            <div className="flex space-x-2">
              <Button 
                onClick={handlePrevVideo}
                size="sm"
                variant="outline"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                onClick={handleNextVideo}
                size="sm"
                variant="outline"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-gray-300 mb-4">{videos[activeVideo].description}</p>
          
          {/* Thumbnails */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {videos.map((video, index) => (
              <div 
                key={video.id}
                className={`relative cursor-pointer rounded-md overflow-hidden ${
                  index === activeVideo ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleThumbnailClick(index)}
              >
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  className="w-full aspect-video object-cover"
                />
                {index === activeVideo && (
                  <div className="absolute inset-0 bg-blue-500 bg-opacity-20"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoGallery;
