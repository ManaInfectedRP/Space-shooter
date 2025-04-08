import React from "react";

export default function Pipe({ x, topHeight, gap }) {
    return (
        <>
            {/* Övre pipe */}
            <div
                style={{
                    position: "absolute",
                    left: x,
                    top: 0,
                    width: 60,
                    height: topHeight,
                    backgroundColor: "green",
                    border: "2px solid #333",
                }}
            />
            {/* Nedre pipe */}
            <div
                style={{
                    position: "absolute",
                    left: x,
                    top: topHeight + gap,
                    width: 60,
                    height: 800 - topHeight - gap,
                    backgroundColor: "green",
                    border: "2px solid #333",
                }}
            />
        </>
    );
}
