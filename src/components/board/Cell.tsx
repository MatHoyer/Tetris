import React from 'react';
import { CellOptions } from '../../types';

type Props = {
    type: CellOptions;
};

export const Cell: React.FC<Props> = ({ type }) => {
    return <div className={`cell ${type}`} />;
};
