/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useCallback } from "react";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage"; // helper file
import { Slider } from "@mui/material";
import MenuButton from "./MenuButton";

// ✅ S3 client setup
const s3 = new S3Client({
  region: "us-east-1",
  endpoint: import.meta.env.VITE_TEBI_ENDPOINT,
  credentials: {
    accessKeyId: import.meta.env.VITE_TEBI_ACCESS_KEY,
    secretAccessKey: import.meta.env.VITE_TEBI_SECRET_KEY,
  },
  forcePathStyle: true,
});

const UploadTebi = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [uploadedSignedUrl, setUploadedSignedUrl] = useState<string | null>(
    null,
  );

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setStatus("");
      const imageUrl = URL.createObjectURL(selectedFile);
      setImageSrc(imageUrl);
      setUploadedSignedUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!file || !croppedAreaPixels || !imageSrc) {
      setStatus("⚠️ No file chosen");
      return;
    }

    setStatus("Cropping image...");
    const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
    if (!croppedBlob) {
      setStatus("❌ Cropping failed.");
      return;
    }

    const croppedFile = new File([croppedBlob], file.name, {
      type: file.type,
    });

    try {
      setStatus("Uploading cropped image...");
      const upload = new Upload({
        client: s3,
        params: {
          Bucket: import.meta.env.VITE_TEBI_BUCKET,
          Key: croppedFile.name,
          Body: croppedFile,
          ContentType: croppedFile.type,
        },
      });

      upload.on("httpUploadProgress", (progress) => {
        if (progress.total && progress.loaded) {
          const percent = Math.round((progress.loaded / progress.total) * 100);
          setStatus(`Uploading... ${percent}%`);
        }
      });

      await upload.done();

      // ✅ Generate signed URL
      const command = new GetObjectCommand({
        Bucket: import.meta.env.VITE_TEBI_BUCKET,
        Key: croppedFile.name,
      });

      const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1 hour

      setUploadedSignedUrl(signedUrl);
      setStatus("✅ Upload successful!");
      setImageSrc(null);
    } catch (err) {
      console.error("❌ Upload failed", err);
      setStatus("❌ Upload failed. Check console.");
    }
  };

  const handleClear = () => {
    setFile(null);
    setImageSrc(null);
    setUploadedSignedUrl(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <div className="sticky top-0 z-50 mb-8 flex items-center justify-between rounded-md bg-white p-4 shadow-md dark:bg-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Data Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <MenuButton />
        </div>
      </div>
      <div className="mx-auto max-w-xl space-y-4 rounded border p-4 shadow-md">
        <h2 className="text-xl font-bold">Upload to Tebi (Signed URL)</h2>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />

        {imageSrc && !uploadedSignedUrl && (
          <>
            <div
              className="relative bg-black"
              style={{ width: 750, height: 300, margin: "0 auto" }}
            >
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={712 / 236}
                cropSize={{ width: 712, height: 236 }}
                objectFit="contain"
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="flex flex-col items-start space-y-2">
              <label className="text-sm">Zoom:</label>
              <Slider
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(_, value) => setZoom(value as number)}
                sx={{ width: 200 }}
              />
            </div>
          </>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleUpload}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Upload
          </button>
          <button
            onClick={handleClear}
            className="rounded bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400"
          >
            Clear
          </button>
        </div>

        {status && <p className="text-sm">{status}</p>}

        {uploadedSignedUrl && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold">
              Uploaded Image (Signed URL):
            </h3>
            <img
              src={uploadedSignedUrl}
              alt="Uploaded"
              className="mt-2 max-w-full rounded border shadow"
            />
            *{" "}
            <p className="mt-2 break-all text-xs text-gray-600">
              {uploadedSignedUrl}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default UploadTebi;
