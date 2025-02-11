import { Card } from "antd";
import React, { useState } from "react";
import './App.css';

const CustomCard = ({ title, extraActionNode, children }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Card
            title={
                <span
                    style={{
                        fontWeight: 600,
                        color: "#576ec1",
                        fontSize: "20px",
                        lineHeight: "24px",
                        fontFamily: "Poppins",
                    }}
                >
                    {title}
                </span>
            }
            extra={extraActionNode}
            style={{
                // width: "100%",
                padding: "10px",
                gap: "8px",
                borderRadius: "8px",
                boxShadow: isHovered
                    ? "0 4px 8px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.15), 0 2px 5px rgba(0, 0, 0, 0.1)"
                    : "0 2px 5px rgba(0, 0, 0, 0.1)",
                transition: "box-shadow 0.3s ease",
                backgroundColor: "#fafafa",
                backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")`,
                backgroundSize: "cover",
                backgroundBlendMode: "multiply",
                backgroundPosition: "center",
                backgroundRepeat: "repeat",
            }}
            bordered={false}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}
        </Card>
    );
};

export default CustomCard;
