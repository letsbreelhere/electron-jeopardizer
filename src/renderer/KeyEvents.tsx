import { EventEmitter } from 'events';
import { createContext } from 'react';

export class KeyEventEmitter extends EventEmitter {}
export const KeyEventContext = createContext({ on: () => null });
