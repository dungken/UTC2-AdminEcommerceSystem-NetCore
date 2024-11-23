import React, { useState } from 'react';
import './ColorBoxes.css';
import { ColorDTO } from './types';

interface ColorSelectorProps {
    selectedColors: ColorDTO[];
    setSelectedColors: React.Dispatch<React.SetStateAction<ColorDTO[]>>;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ selectedColors, setSelectedColors }) => {
    const [customColor, setCustomColor] = useState<string>('#000000'); // Default to black
    const [customColorName, setCustomColorName] = useState<string>(''); // Custom color name

    // Toggle the color in the selectedColors list
    const handleColorChange = (color: ColorDTO) => {
        setSelectedColors((prev: ColorDTO[]) => {
            // Check if the color is already selected
            const isColorSelected = prev.some((selectedColor) => selectedColor.colorCode === color.colorCode);
            // If color is selected, remove it; otherwise, add it
            return isColorSelected
                ? prev.filter((selectedColor) => selectedColor.colorCode !== color.colorCode)
                : [...prev, color];
        });
    };


    // Add a custom color to the selectedColors list
    const handleCustomColorAdd = () => {
        const newColor: ColorDTO = {
            // id: '123', // Use colorCode as unique id
            name: customColorName || 'Custom Color', // Fallback name if empty
            colorCode: customColor,
        };

        // Only add if it's not already selected
        if (!selectedColors.some((color) => color.colorCode === newColor.colorCode)) {
            setSelectedColors((prev: ColorDTO[]) => [...prev, newColor]);
        }
    };

    return (
        <div className="col-md-4">
            {/* Custom Color Picker Section */}
            <div className="custom-color">
                <label>Choose Custom Color:</label>
                <div className="d-flex align-items-center">
                    <input
                        type="color"
                        value={customColor}
                        onChange={(e) => setCustomColor(e.target.value)}
                        style={{ marginRight: '10px' }}
                    />
                    <input
                        type="text"
                        value={customColorName}
                        onChange={(e) => setCustomColorName(e.target.value)}
                        placeholder="Custom Color Name"
                        style={{ marginRight: '10px' }}
                    />
                    <button
                        className="btn btn-primary"
                        onClick={handleCustomColorAdd}
                        disabled={selectedColors.some((color) => color.colorCode === customColor)}
                    >
                        Add Color
                    </button>
                </div>
            </div>

            {/* Selected Colors Section */}
            <div className="selected-colors mt-3">
                <h5>Selected Colors:</h5>
                <div className="selected-colors-display d-flex align-items-center justify-content-start g-2">
                    {selectedColors.map((color) => (
                        <div
                            key={color.colorCode}
                            className="color-box selected"
                            style={{ backgroundColor: color.colorCode }}
                            title={color.name}
                            onClick={() => handleColorChange(color)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ColorSelector;
