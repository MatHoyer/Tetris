import { Block, BlockShape, BoardShape, EmptyCell, SHAPES } from '@/types';
import { Board } from './Board';
import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { useToggle } from '@/hooks/useToggle';

const createBoard = () => {
    return Array(20)
        .fill(null)
        .map(() => Array(10).fill(EmptyCell.Empty));
};

const getRandomBlock = () => {
    const blocks = Object.keys(Block);
    const randomIndex = Math.floor(Math.random() * blocks.length);
    return blocks[randomIndex];
};

export const Game: React.FC = () => {
    const [playing, togglePlaying] = useToggle(false);
    const [board, setBoard] = useState<BoardShape>(createBoard);
    const [speed, setSpeed] = useState(1000);

    const spawnBlock = (newBoard: BoardShape) => {
        const name = getRandomBlock();
        const newBlock = SHAPES[name];
        const x = Math.floor((board[0].length - newBlock.shape[0].length) / 2);
        const y = newBlock.shape.findIndex((row) => row.includes(true));
        for (let i = y; i < newBlock.shape.length; i++) {
            for (let j = 0; j < newBlock.shape[i].length; j++) {
                if (newBlock.shape[i][j] && newBoard[i - y][j + x] !== EmptyCell.Empty) {
                    togglePlaying();
                    return;
                }
            }
        }

        setSpeed(1000);
        for (let i = y; i < newBlock.shape.length; i++) {
            for (let j = 0; j < newBlock.shape[i].length; j++) {
                if (newBlock.shape[i][j]) {
                    newBoard[i - y][j + x] = name;
                }
            }
        }
    };

    const clearBoard = () => {
        const newBoard = [...board];
        for (let i = 0; i < newBoard.length; i++) {
            for (let j = 0; j < newBoard[i].length; j++) {
                newBoard[i][j] = EmptyCell.Empty;
            }
        }
        setBoard(newBoard);
    };

    const getCurrentCellsName = () => {
        for (let i = board.length - 1; i >= 0; i--) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] !== EmptyCell.Empty && !board[i][j].includes('fixed')) {
                    return board[i][j];
                }
            }
        }
        return '0';
    };

    const getCurrentCells = () => {
        const cells = [];
        for (let i = board.length - 1; i >= 0; i--) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] !== EmptyCell.Empty && !board[i][j].includes('fixed')) {
                    cells.push({ x: j, y: i });
                }
            }
        }
        return cells;
    };

    const fixPiece = (newBoard: BoardShape) => {
        for (let i = 0; i < newBoard.length; i++) {
            for (let j = 0; j < newBoard[i].length; j++) {
                if (newBoard[i][j] !== EmptyCell.Empty && !newBoard[i][j].includes('fixed')) {
                    newBoard[i][j] = `${newBoard[i][j]} fixed`;
                }
            }
        }
    };

    const rotateCells = () => {
        const newBoard = [...board];
        const cells = getCurrentCells();
        const name = getCurrentCellsName();

        const centerX = cells.reduce((sum, cell) => sum + cell.x, 0) / cells.length;
        const centerY = cells.reduce((sum, cell) => sum + cell.y, 0) / cells.length;

        const rotatedCells = cells.map((cell) => {
            const x = cell.x - centerX;
            const y = cell.y - centerY;

            return {
                x: Math.round(-y + centerX),
                y: Math.round(x + centerY),
            };
        });

        if (
            !rotatedCells.some(
                (cell) => cell.x < 0 || cell.x >= newBoard[0].length || cell.y < 0 || cell.y >= newBoard.length
            )
        ) {
            cells.map((cell) => {
                newBoard[cell.y][cell.x] = EmptyCell.Empty;
            });
            rotatedCells.map((cell) => {
                newBoard[cell.y][cell.x] = name;
            });
            setBoard(newBoard);
        }
    };

    const goRightCells = () => {
        const newBoard = [...board];
        const cells = getCurrentCells();

        for (let i = 0; i < cells.length; i++) {
            const { x, y } = cells[i];
            if (
                x === newBoard[y].length - 1 ||
                (newBoard[y][x + 1] !== EmptyCell.Empty && newBoard[y][x + 1].includes('fixed'))
            ) {
                return;
            }
        }

        for (let i = cells.length - 1; i >= 0; i--) {
            const { x, y } = cells[i];
            newBoard[y][x + 1] = board[y][x];
            newBoard[y][x] = EmptyCell.Empty;
        }
        setBoard(newBoard);
    };

    const goLeftCells = () => {
        const newBoard = [...board];
        const cells = getCurrentCells();

        for (let i = 0; i < cells.length; i++) {
            const { x, y } = cells[i];
            if (x === 0 || (newBoard[y][x - 1] !== EmptyCell.Empty && newBoard[y][x - 1].includes('fixed'))) {
                return;
            }
        }

        for (let i = 0; i < cells.length; i++) {
            const { x, y } = cells[i];
            newBoard[y][x - 1] = board[y][x];
            newBoard[y][x] = EmptyCell.Empty;
        }
        setBoard(newBoard);
    };

    const destroyLine = (newBoard: BoardShape) => {
        for (let i = newBoard.length - 1; i >= 0; i--) {
            if (newBoard[i].every((cell) => cell.includes('fixed'))) {
                newBoard.splice(i, 1);
                newBoard.unshift(Array(10).fill(EmptyCell.Empty));
            }
        }
    };

    const goDownCells = (newBoard: BoardShape, cells: { x: number; y: number }[]) => {
        for (let i = 0; i < cells.length; i++) {
            const { x, y } = cells[i];
            if (
                y === newBoard.length - 1 ||
                (newBoard[y + 1][x] !== EmptyCell.Empty && newBoard[y + 1][x].includes('fixed'))
            ) {
                fixPiece(newBoard);
                destroyLine(newBoard);
                return;
            }
        }

        for (let i = 0; i < cells.length; i++) {
            const { x, y } = cells[i];
            newBoard[y + 1][x] = board[y][x];
            newBoard[y][x] = EmptyCell.Empty;
        }
    };

    const handlePlaying = () => {
        togglePlaying();
        if (!playing) clearBoard();
    };

    useEffect(() => {
        if (playing) {
            const int = setInterval(() => {
                const newBoard = [...board];
                const cells = getCurrentCells();
                if (cells.length === 0) {
                    spawnBlock(newBoard);
                } else {
                    goDownCells(newBoard, cells);
                }
                setBoard(newBoard);
            }, speed);
            return () => {
                clearInterval(int);
            };
        }
    }, [playing, speed, board]);

    useEffect(() => {
        if (playing) {
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'ArrowLeft') {
                    goLeftCells();
                } else if (e.key === 'ArrowRight') {
                    goRightCells();
                } else if (e.key === 'ArrowDown') {
                    console.log('down');
                    setSpeed(100);
                } else if (e.key === 'ArrowUp') {
                    rotateCells();
                }
            };
            const handleKeyUp = (e: KeyboardEvent) => {
                if (e.key === 'ArrowDown') {
                    setSpeed(1000);
                }
            };

            window.addEventListener('keydown', handleKeyDown);
            window.addEventListener('keyup', handleKeyUp);

            return () => {
                window.removeEventListener('keydown', handleKeyDown);
                window.removeEventListener('keyup', handleKeyUp);
            };
        }
    }, [board]);

    return (
        <div>
            <h1 className="text-4xl">TETRIS</h1>
            <div className="app">
                <Board currentBoard={board} />
                <div className="controls">
                    <Button onClick={handlePlaying}>{playing ? 'Quit' : 'Play'}</Button>
                </div>
            </div>
        </div>
    );
};
