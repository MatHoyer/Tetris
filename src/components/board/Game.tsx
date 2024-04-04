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

    const spawnBlock = () => {
        const newBoard = [...board];
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
        setBoard(newBoard);
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

    const getCurrentCellsPoint = () => {
        const name = getCurrentCellsName();
        if (name === 'I') {
            const cells = getCurrentCells();
            // Vertical
            if (cells[0].x === cells[1].x) {
            }
            // Horizontal
            else if (cells[0].y === cells[1].y) {
                return cells[0];
            }
        }
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

    const fixPiece = () => {
        const newBoard = [...board];
        for (let i = 0; i < newBoard.length; i++) {
            for (let j = 0; j < newBoard[i].length; j++) {
                if (newBoard[i][j] !== EmptyCell.Empty && !newBoard[i][j].includes('fixed')) {
                    newBoard[i][j] = `${newBoard[i][j]} fixed`;
                }
            }
        }
        setBoard(newBoard);
    };

    const rotateCells = () => {
        const newBoard = [...board];
        const cell = getCurrentCellsPoint();
        const name = getCurrentCellsName();
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

    const goDownCells = (cells: { x: number; y: number }[]) => {
        const newBoard = [...board];
        for (let i = 0; i < cells.length; i++) {
            const { x, y } = cells[i];
            if (
                y === newBoard.length - 1 ||
                (newBoard[y + 1][x] !== EmptyCell.Empty && newBoard[y + 1][x].includes('fixed'))
            ) {
                fixPiece();
                return;
            }
        }

        for (let i = 0; i < cells.length; i++) {
            const { x, y } = cells[i];
            newBoard[y + 1][x] = board[y][x];
            newBoard[y][x] = EmptyCell.Empty;
        }
        setBoard(newBoard);
    };

    const handlePlaying = () => {
        togglePlaying();
        if (!playing) clearBoard();
    };

    useEffect(() => {
        if (playing) {
            const int = setInterval(() => {
                const cells = getCurrentCells();
                if (cells.length === 0) {
                    spawnBlock();
                } else {
                    goDownCells(cells);
                }
            }, speed);
            return () => {
                clearInterval(int);
            };
        }
    }, [playing, speed]);

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
    }, [playing]);

    return (
        <div>
            <h1 className="text-4xl">TETRIS</h1>
            <div className="app">
                <Board currentBoard={board} />
                <div className="controls">
                    <Button onClick={handlePlaying}>{playing ? 'Quit' : 'Play'}</Button>
                    <Button onClick={spawnBlock}>Spawn</Button>
                </div>
            </div>
        </div>
    );
};
