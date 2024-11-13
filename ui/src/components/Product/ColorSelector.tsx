import React, { useState } from 'react';
import './ColorBoxes.css';

const colors = [
    { name: '', value: 'red', hex: '#ff4d4d' },
    { name: '', value: 'blue', hex: '#4d79ff' },
    { name: '', value: 'green', hex: '#5cd65c' },
    { name: '', value: 'yellow', hex: '#ffdb4d' },
    { name: '', value: 'blue', hex: '#ff4d4d' },
    { name: '', value: 'red', hex: '#ffdb4d' },
    { name: '', value: 'blue', hex: '#ffdb4d' },
    { name: '', value: 'yellow', hex: '#4d79ff' },
    { name: '', value: 'blue', hex: '#5cd65c' },
];

const ColorSelector = () => {
    const [selectedColors, setSelectedColors] = useState<string[]>([]);

    const handleColorChange = (colorValue: string) => {
        setSelectedColors((prev) =>
            prev.includes(colorValue)
                ? prev.filter((color) => color !== colorValue)
                : [...prev, colorValue]
        );
    };

    return (
        <div className="col-md-4">
            <label>Select Color:</label>
            <div className="color-options">
                {colors.map((color) => (
                    <div
                        key={color.value}
                        className={`color-box ${selectedColors.includes(color.value) ? 'selected' : ''}`}
                        style={{ backgroundColor: color.hex }}
                        onClick={() => handleColorChange(color.value)}
                    >
                        {color.name}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ColorSelector;
