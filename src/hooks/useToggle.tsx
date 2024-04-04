import { useState } from 'react';

export const useToggle = (initialValue: boolean): [boolean, () => void] => {
    const [value, setValue] = useState(initialValue);
    const toggle = () => setValue((v) => !v);
    return [value, toggle];
};
