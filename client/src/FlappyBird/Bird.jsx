import React from "react";

export default function Bird({ y }) {
    return (
        <div
            style={{
                position: "absolute",
                left: 100,
                top: y,
                fontSize: "32px",
                transform: "scaleX(-1)", // <-- flippa horisontellt
            }}
        >
            🕊️
        </div>
    );
}
