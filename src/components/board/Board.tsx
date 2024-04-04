import { Cell } from './Cell';
import { BlockType, BoardShape } from '../../types';
import React from 'react';

type Props = {
    currentBoard: BoardShape;
};

export const Board: React.FC<Props> = ({ currentBoard }) => {
    return (
        <div className="board">
            {currentBoard.map((row, rowIndex) => (
                <div className="row" key={`${rowIndex}`}>
                    {row.map((cell, colIndex) => (
                        <Cell key={`${rowIndex}-${colIndex}`} type={cell.replace('fixed', '') as BlockType} />
                    ))}
                </div>
            ))}
        </div>
    );
};
