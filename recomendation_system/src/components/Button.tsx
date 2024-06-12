import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className }) => {
    return (
        <button
            style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
            }}
            className={className}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;