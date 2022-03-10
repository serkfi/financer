import { Routes, Route } from 'react-router-dom';

import { AddTransfer } from './AddTransfer';
import { EditTransfer } from './EditTransfer';
import { Transfer } from './Transfer';
import { Transfers } from './Transfers';

export const TransfersRouter = (): JSX.Element => {
  return (
    <Routes>
      <Route index element={<Transfers />} />
      <Route path="add" element={<AddTransfer />} />
      <Route path=":id" element={<Transfer />} />
      <Route path=":id/edit" element={<EditTransfer />} />
    </Routes>
  );
};