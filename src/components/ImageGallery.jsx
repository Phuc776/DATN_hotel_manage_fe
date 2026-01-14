import { useEffect, useState } from "react";
import { Modal } from "antd";

export default function ImageGallery({ images = [], mainHeight = 320, thumbnailSize = 80 }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    if (images && images.length > 0) setSelectedImage(images[0]);
    else setSelectedImage(null);
  }, [images]);

  const openPreview = () => setIsPreviewOpen(true);
  const closePreview = () => setIsPreviewOpen(false);

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        {selectedImage ? (
          <img
            src={selectedImage}
            alt="selected"
            onClick={openPreview}
            style={{
              height: mainHeight,
              width: "100%",
              objectFit: "cover",
              borderRadius: 8,
              cursor: "pointer",
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              height: mainHeight,
              width: "100%",
              background: "#f3f4f6",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9ca3af",
            }}
          >
            Không có hình ảnh
          </div>
        )}
      </div>

      {images && images.length > 1 && (
        <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
          {images.slice(1).map((url, idx) => {
            const isActive = url === selectedImage;
            return (
              <img
                key={idx}
                src={url}
                alt={`thumb-${idx}`}
                onClick={() => setSelectedImage(url)}
                style={{
                  width: thumbnailSize,
                  height: thumbnailSize,
                  objectFit: "cover",
                  borderRadius: 6,
                  cursor: "pointer",
                  border: isActive ? "2px solid #1890ff" : "2px solid transparent",
                }}
              />
            );
          })}
        </div>
      )}

      <Modal open={isPreviewOpen} onCancel={closePreview} footer={null} centered>
        <img
          src={selectedImage}
          alt="preview"
          style={{ maxWidth: "90%", maxHeight: "80vh", objectFit: "contain", display: "block", margin: "0 auto" }}
        />
      </Modal>
    </div>
  );
}
