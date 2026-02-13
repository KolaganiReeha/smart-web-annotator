/* global chrome */
import React, { useEffect, useRef, useState } from "react";
import "./App.css";

const TOOLS = {
  RECT: "rectangle",
  ARROW: "arrow",
  FREE: "free",
  TEXT: "text",
  HIGHLIGHT: "highlight",
  BLUR: "blur"
};

function App() {
  const [textInput, setTextInput] = useState("");
  const [textColor, setTextColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(20);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [bold, setBold] = useState(false);
  const [textPosition, setTextPosition] = useState(null);

  const canvasRef = useRef(null);
  const [baseImage, setBaseImage] = useState(null);

  const [tool, setTool] = useState(TOOLS.RECT);
  const [annotations, setAnnotations] = useState([]);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const [drawing, setDrawing] = useState(false);
  const [current, setCurrent] = useState(null);

  // LOAD SCREENSHOT
  useEffect(() => {
    chrome.storage.local.get("screenshot", (data) => {
      if (!data.screenshot) return;
      const img = new Image();
      img.src = data.screenshot;
      img.onload = () => {
        setBaseImage(img);
        redrawCanvas(img, annotations);
      };
    });
  }, []);

  // REDRAW WHEN ANNOTATIONS CHANGE
  useEffect(() => {
    if (baseImage) {
      redrawCanvas(baseImage, annotations);
    }
  }, [annotations]);

  const redrawCanvas = (img, annotationList) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    annotationList.forEach((ann) => drawAnnotation(ctx, ann));
  };

  const drawAnnotation = (ctx, ann) => {
    ctx.lineWidth = 2;

    switch (ann.type) {
      case TOOLS.RECT:
        ctx.strokeStyle = "red";
        ctx.strokeRect(ann.x, ann.y, ann.w, ann.h);
        break;

      case TOOLS.ARROW:
        drawArrow(ctx, ann.x, ann.y, ann.x + ann.w, ann.y + ann.h);
        break;

      case TOOLS.FREE:
        ctx.strokeStyle = "blue";
        ctx.beginPath();
        ann.points.forEach((p, i) => {
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
        break;

      case TOOLS.TEXT:
        ctx.fillStyle = ann.color || "black";
        ctx.font = `${ann.bold ? "bold" : ""} ${ann.fontSize || 20}px ${ann.fontFamily || "Arial"}`;
        ctx.fillText(ann.text, ann.x, ann.y);
        break;

      case TOOLS.HIGHLIGHT:
        ctx.fillStyle = "rgba(255,255,0,0.3)";
        ctx.fillRect(ann.x, ann.y, ann.w, ann.h);
        break;

      case TOOLS.BLUR:
        ctx.filter = "blur(5px)";
        ctx.drawImage(
          baseImage,
          ann.x,
          ann.y,
          ann.w,
          ann.h,
          ann.x,
          ann.y,
          ann.w,
          ann.h
        );
        ctx.filter = "none";
        break;

      default:
        break;
    }
  };

  const drawArrow = (ctx, x1, y1, x2, y2) => {
    const headlen = 10;
    const angle = Math.atan2(y2 - y1, x2 - x1);

    ctx.strokeStyle = "green";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(
      x2 - headlen * Math.cos(angle - Math.PI / 6),
      y2 - headlen * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      x2 - headlen * Math.cos(angle + Math.PI / 6),
      y2 - headlen * Math.sin(angle + Math.PI / 6)
    );
    ctx.lineTo(x2, y2);
    ctx.fillStyle = "green";
    ctx.fill();
  };

  const addTextAnnotation = () => {
  if (!textInput || !textPosition) return;

  const newAnnotation = {
    type: TOOLS.TEXT,
    x: textPosition.x,
    y: textPosition.y,
    text: textInput,
    color: textColor,
    fontSize,
    fontFamily,
    bold
  };

  addAnnotation(newAnnotation);

  setTextInput("");
  setTextPosition(null);
};

  // MOUSE EVENTS
 const handleMouseDown = (e) => {
  const x = e.nativeEvent.offsetX;
  const y = e.nativeEvent.offsetY;

  if (tool === TOOLS.FREE) {
    setDrawing(true);
    setCurrent({ type: tool, points: [{ x, y }] });
  } 
  else if (tool === TOOLS.TEXT) {
    setTextPosition({ x, y });
  } 
  else {
    setDrawing(true);
    setCurrent({ type: tool, x, y, w: 0, h: 0 });
  }
};

  const handleMouseMove = (e) => {
    if (!drawing || !current) return;

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    if (tool === TOOLS.FREE) {
      setCurrent((prev) => ({
        ...prev,
        points: [...prev.points, { x, y }]
      }));
    } else {
      setCurrent((prev) => ({
        ...prev,
        w: x - prev.x,
        h: y - prev.y
      }));
    }
  };

  const downloadPNG = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "annotation.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleMouseUp = () => {
    if (!drawing || !current) return;
    addAnnotation(current);
    setCurrent(null);
    setDrawing(false);
  };

  const addAnnotation = (ann) => {
    setHistory([...history, annotations]);
    setRedoStack([]);
    setAnnotations([...annotations, ann]);
  };

  const undo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setRedoStack([annotations, ...redoStack]);
    setAnnotations(prev);
    setHistory(history.slice(0, -1));
  };

  const redo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setHistory([...history, annotations]);
    setAnnotations(next);
    setRedoStack(redoStack.slice(1));
  };

  const saveSession = () => {
    chrome.storage.local.set({ annotations }, () => {
      alert("Session Saved!");
    });
  };

  return (
    <div>
      <div className="toolbar">
        {Object.values(TOOLS).map((t) => (
          <button key={t} onClick={() => setTool(t)}>
            {t}
          </button>
        ))}
        <button onClick={undo}>Undo</button>
        <button onClick={redo}>Redo</button>
        <button onClick={saveSession}>Save</button>
        <button onClick={downloadPNG}>Download PNG</button>
      </div>

      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />

      {tool === TOOLS.TEXT && (
      <div style={{
        position: "fixed",
        top: "70px",
        left: "10px",
        background: "white",
        padding: "10px",
        borderRadius: "8px",
        zIndex: 2000,
        display: "flex",
        gap: "6px",
        flexWrap: "wrap",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
      }}>
  
        <input
          type="text"
          placeholder="Enter text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
        />

        <input
          type="color"
          value={textColor}
          onChange={(e) => setTextColor(e.target.value)}
        />

        <input
          type="number"
          value={fontSize}
          min="10"
          max="100"
          onChange={(e) => setFontSize(Number(e.target.value))}
          style={{ width: "70px" }}
        />

        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
        >
          <option value="Arial">Arial</option>
          <option value="Verdana">Verdana</option>
          <option value="Times New Roman">Times</option>
          <option value="Courier New">Courier</option>
          <option value="Georgia">Georgia</option>
        </select>

        <button onClick={() => setBold(!bold)}>
          {bold ? "Bold ON" : "Bold"}
        </button>

        <button onClick={addTextAnnotation}>
          Add Text
        </button>
      </div>
    )}

    </div>
  );
}

export default App;
