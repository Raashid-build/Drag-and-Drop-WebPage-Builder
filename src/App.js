import React, { useState, useRef } from "react";
import "./App.css";

function App() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [rightItems, setRightItems] = useState([]);
  const [leftItems, setLeftItems] = useState([
    { id: 1, icon: "bi bi-list", text: "Navbar", type: "navbar" },
    { id: 2, icon: "bi bi-images", text: "Carousel Image", type: "carousel" },
    {
      id: 3,
      icon: "bi bi-grid-3x3-gap-fill",
      text: "Product Grid",
      type: "grid",
    },
    { id: 4, icon: "bi bi-image", text: "Image with Text", type: "imagetext" },
    { id: 5, icon: "bi bi-card-image", text: "Image", type: "image" },
    { id: 6, icon: "bi bi-fonts", text: "Text", type: "text" },
    {
      id: 7,
      icon: "bi bi-person-lines-fill",
      text: "Customer Reviews",
      type: "review",
    },
    {
      id: 8,
      icon: "bi bi-file-earmark-text",
      text: "Contact Us",
      type: "contact",
    },
    { id: 9, icon: "bi bi-grip-horizontal", text: "Footer", type: "footer" },
  ]);

  // Store content for each component
  const [componentContent, setComponentContent] = useState({});
  const fileInputRefs = useRef({});

  const handleDragStart = (e, item) => {
    setSelectedItem(item);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDropToRight = (e) => {
    e.preventDefault();
    if (
      selectedItem &&
      !rightItems.find((item) => item.id === selectedItem.id)
    ) {
      // Move from left to right
      setLeftItems((prev) =>
        prev.filter((item) => item.id !== selectedItem.id)
      );
      setRightItems((prev) => [...prev, selectedItem]);

      // Initialize content for functional components
      if (selectedItem.type === "text") {
        setComponentContent((prev) => ({
          ...prev,
          [selectedItem.id]: { text: "Click to edit text..." },
        }));
      } else if (selectedItem.type === "image") {
        setComponentContent((prev) => ({
          ...prev,
          [selectedItem.id]: { imageUrl: null },
        }));
      }
      setSelectedItem(null);
    }
  };

  const handleDropToLeft = (e) => {
    e.preventDefault();
    if (
      selectedItem &&
      !leftItems.find((item) => item.id === selectedItem.id)
    ) {
      // Move from right to left
      setRightItems((prev) =>
        prev.filter((item) => item.id !== selectedItem.id)
      );
      setLeftItems((prev) => [...prev, selectedItem]);

      // Clean up content
      setComponentContent((prev) => {
        const newContent = { ...prev };
        delete newContent[selectedItem.id];
        return newContent;
      });

      setSelectedItem(null);
    }
  };

  const handleTextEdit = (itemId, newText) => {
    setComponentContent((prev) => ({
      ...prev,
      [itemId]: { text: newText },
    }));
  };

  const handleImageUpload = (itemId, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setComponentContent((prev) => ({
          ...prev,
          [itemId]: { imageUrl: event.target.result },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const DraggableItem = ({ item, source }) => {
    if (source === "left") {
      return (
        <div
          className="item"
          draggable="true"
          onDragStart={(e) => handleDragStart(e, item)}
        >
          <i className={item.icon}></i>
          {item.text}
        </div>
      );
    }

    // Render functional components in the right panel
    if (source === "right") {
      if (item.type === "text") {
        return (
          <div className="functional-component text-component">
            <div
              className="component-header"
              draggable="true"
              onDragStart={(e) => handleDragStart(e, item)}
            >
              <i className={item.icon}></i>
              <span>{item.text}</span>
              <i className="bi bi-arrows-move drag-handle"></i>
            </div>
            <div
              className="editable-text"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleTextEdit(item.id, e.target.innerText)}
              dangerouslySetInnerHTML={{
                __html:
                  componentContent[item.id]?.text || "Click to edit text...",
              }}
            />
          </div>
        );
      }

      if (item.type === "image") {
        return (
          <div className="functional-component image-component">
            <div
              className="component-header"
              draggable="true"
              onDragStart={(e) => handleDragStart(e, item)}
            >
              <i className={item.icon}></i>
              <span>{item.text}</span>
              <i className="bi bi-arrows-move drag-handle"></i>
            </div>
            <div className="image-upload-area">
              {componentContent[item.id]?.imageUrl ? (
                <div className="image-preview">
                  <img
                    src={componentContent[item.id].imageUrl}
                    alt="Uploaded"
                  />
                  <button
                    className="change-image-btn"
                    onClick={() => fileInputRefs.current[item.id]?.click()}
                  >
                    <i className="bi bi-pencil"></i> Change Image
                  </button>
                </div>
              ) : (
                <div
                  className="upload-placeholder"
                  onClick={() => fileInputRefs.current[item.id]?.click()}
                >
                  <i className="bi bi-cloud-upload"></i>
                  <p>Click to upload image</p>
                </div>
              )}
              <input
                ref={(el) => (fileInputRefs.current[item.id] = el)}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleImageUpload(item.id, e)}
              />
            </div>
          </div>
        );
      }

      // Default draggable item for non-functional components
      return (
        <div
          className="item"
          draggable="true"
          onDragStart={(e) => handleDragStart(e, item)}
        >
          <i className={item.icon}></i>
          {item.text}
        </div>
      );
    }
  };

  return (
    <div className="wrapper">
      <div
        className="left"
        onDragOver={handleDragOver}
        onDrop={handleDropToLeft}
      >
        <h3>Available Components</h3>
        {leftItems.map((item) => (
          <DraggableItem key={item.id} item={item} source="left" />
        ))}
      </div>

      <div
        className="right"
        onDragOver={handleDragOver}
        onDrop={handleDropToRight}
      >
        <h3>Selected Components</h3>
        {rightItems.length === 0 && (
          <div className="empty-state">
            <i className="bi bi-arrow-left-circle"></i>
            <p>Drag components here to build your page</p>
          </div>
        )}
        {rightItems.map((item) => (
          <DraggableItem key={item.id} item={item} source="right" />
        ))}
      </div>
    </div>
  );
}

export default App;
