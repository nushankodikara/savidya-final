 'use client';

import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, Upload, Video, Camera, XCircle } from 'lucide-react';
import { sampleGlassesImages, getKeywordsFromRecommendations } from '@/utils/sampleImages'; // Adjust path if needed

// --- Types --- (Optional but recommended)
type PredictionResponse = {
  predicted_shape: string;
  confidence: number;
  recommendations: string[];
};

type ApiError = {
  detail: string;
};

// --- Constants ---
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
const PREDICT_ENDPOINT = `${BACKEND_URL}/predict`;

// --- Component ---
export default function PredictPage() {
  const [activeTab, setActiveTab] = useState<string>('upload'); // 'upload' or 'webcam'
  const [imageSrc, setImageSrc] = useState<string | null>(null); // For preview (data URL or object URL)
  const [imageFile, setImageFile] = useState<File | null>(null); // For sending file upload
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers ---
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
        setPrediction(null); // Clear previous prediction
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const captureWebcam = useCallback(() => {
    if (webcamRef.current) {
      const imageSrcBase64 = webcamRef.current.getScreenshot();
      if (imageSrcBase64) {
        setImageSrc(imageSrcBase64);
        // Convert base64 to File object for sending
        fetch(imageSrcBase64)
          .then(res => res.blob())
          .then(blob => {
             const file = new File([blob], "webcam_capture.jpg", { type: "image/jpeg" });
             setImageFile(file);
          });
        setPrediction(null); // Clear previous prediction
        setError(null);
      } else {
        setError("Could not capture image from webcam.");
      }
    } else {
        setError("Webcam not available or ready.");
    }
  }, [webcamRef]);

  const clearImage = () => {
    setImageSrc(null);
    setImageFile(null);
    setPrediction(null);
    setError(null);
    // Reset file input value if it exists
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePredict = async () => {
    if (!imageFile) {
      setError('Please upload or capture an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPrediction(null);

    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      const response = await axios.post<PredictionResponse>(PREDICT_ENDPOINT, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPrediction(response.data);
    } catch (err) {
        console.error("Prediction API error:", err);
        if (axios.isAxiosError(err) && err.response) {
            // Attempt to parse the error response data
            let errorMessage = 'Prediction failed. Please try again.';
            try {
              const apiError = err.response.data as ApiError | string;
              if (typeof apiError === 'string') {
                // Handle plain text errors
                errorMessage = apiError;
              } else if (apiError && apiError.detail) {
                // Handle JSON errors with a 'detail' key
                errorMessage = apiError.detail;
              }
            } catch (parseError) {
              console.error("Could not parse error response:", err.response.data);
            }
            setError(errorMessage);
        } else {
            setError('An unexpected error occurred. Please check the connection or try again.');
        }
    } finally {
      setIsLoading(false);
    }
  };

  // --- Rendering ---

  // Helper to get sample image URLs
  const getSampleImages = () => {
      if (!prediction) return [];
      const keywords = getKeywordsFromRecommendations(prediction.recommendations);
      let images: string[] = [];
      keywords.forEach(keyword => {
          images = images.concat(sampleGlassesImages[keyword] || []);
      });
      // Add default if no keywords matched or no images found
      if (images.length === 0) {
          images = images.concat(sampleGlassesImages['default'] || []);
      }
      // Return unique images
      return Array.from(new Set(images));
  }

  const recommendedSampleImages = getSampleImages();

  return (
    <main className="container mx-auto p-4 md:p-8">
      <h1 className="scroll-m-20 text-3xl font-bold tracking-tight lg:text-4xl mb-8 text-center">
        Glasses Recommendation
      </h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upload or Capture Your Image</CardTitle>
          <CardDescription>Choose one method to provide your image.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload"><Upload className="mr-2 h-4 w-4"/> Upload File</TabsTrigger>
              <TabsTrigger value="webcam"><Video className="mr-2 h-4 w-4"/> Use Webcam</TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="mt-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="picture">Picture</Label>
                <Input id="picture" type="file" accept="image/png, image/jpeg" onChange={handleFileChange} ref={fileInputRef} />
              </div>
            </TabsContent>
            <TabsContent value="webcam" className="mt-4 flex flex-col items-center">
             <div className="rounded-md border overflow-hidden mb-4 w-full max-w-md aspect-video bg-muted flex items-center justify-center">
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full h-full"
                    videoConstraints={{ facingMode: "user", width: 640, height: 480 }} // Added constraints
                />
             </div>
              <Button onClick={captureWebcam} variant="outline">
                <Camera className="mr-2 h-4 w-4" /> Capture Photo
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {(imageSrc || isLoading || error || prediction) && (
        <Card>
            <CardHeader>
                <CardTitle>Analysis & Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {imageSrc && (
                    <div className="relative mb-4 text-center">
                         <p className="text-sm text-muted-foreground mb-2">Your Image:</p>
                         <div className="relative w-[250px] h-[250px] inline-block border rounded-md overflow-hidden">
                            <Image
                                 src={imageSrc}
                                 alt="Uploaded or captured image"
                                 fill
                                 style={{ objectFit: 'contain'}}
                                 sizes="250px"
                             />
                         </div>
                         <Button variant="ghost" size="icon" className="absolute top-0 right-0 m-1 bg-background/50 hover:bg-background/80 rounded-full" onClick={clearImage} title="Clear Image">
                             <XCircle className="h-5 w-5 text-muted-foreground hover:text-destructive" />
                         </Button>
                     </div>
                )}

                {imageSrc && !prediction && !isLoading && (
                     <div className="text-center">
                         <Button onClick={handlePredict} size="lg">
                             Analyze Face Shape
                         </Button>
                     </div>
                )}

                {isLoading && (
                    <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Analyzing your image... Please wait.</span>
                    </div>
                )}

                {error && (
                    <Alert variant="destructive">
                        <XCircle className="h-4 w-4" /> {/* Icon added */}
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {prediction && (
                    <div className="space-y-6"> {/* Increased spacing */}
                        <div className="text-center border-b pb-4">
                            <p className="text-lg font-semibold">Detected Face Shape:</p>
                            <Badge variant="secondary" className="text-xl mt-1 px-4 py-1"> {/* Larger badge */}
                                {prediction.predicted_shape.charAt(0).toUpperCase() + prediction.predicted_shape.slice(1)}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">(Confidence: {(prediction.confidence * 100).toFixed(1)}%)</p>
                        </div>

                        <div className="px-2">
                             <p className="text-lg font-semibold mb-3">Recommendations:</p> {/* Increased size/margin */}
                             <ul className="list-disc list-inside space-y-1.5 text-muted-foreground"> {/* Increased spacing */}
                                 {prediction.recommendations.map((rec, index) => (
                                     <li key={index}>{rec}</li>
                                 ))}
                             </ul>
                        </div>

                        {recommendedSampleImages.length > 0 && (
                            <div className="px-2 border-t pt-4">
                                <p className="text-lg font-semibold mb-3">Suggested Styles Examples:</p> {/* Increased size/margin */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {recommendedSampleImages.map((imgUrl, index) => (
                                        <div key={index} className="relative aspect-[4/3] border rounded-md overflow-hidden bg-muted hover:opacity-90 transition-opacity">
                                             {/* Ensure path starts from /public - Image paths need to be correct */}
                                             <Image
                                                 src={imgUrl} // Assumes images are in public/images/glasses/...
                                                 alt={`Sample style ${index + 1}`}
                                                 fill
                                                 style={{ objectFit: 'contain'}}
                                                 sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                                 onError={(e) => { e.currentTarget.src = '/images/placeholder.png'; /* Optional: Show placeholder on error */ }}
                                                 loading="lazy"
                                             />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
      )}
    </main>
  );
}
