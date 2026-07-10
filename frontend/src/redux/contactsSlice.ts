import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  owner_id: number;
}

interface ContactsState {
  list: Contact[];
  selectedContact: Contact | null;
  searchQuery: string;
  loading: boolean;
  error: string | null;
}

const initialState: ContactsState = {
  list: [],
  selectedContact: null,
  searchQuery: '',
  loading: false,
  error: null,
};

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    fetchContactsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchContactsSuccess(state, action: PayloadAction<Contact[]>) {
      state.loading = false;
      state.list = action.payload;
      if (state.selectedContact) {
        const found = action.payload.find(c => c.id === state.selectedContact?.id);
        state.selectedContact = found || null;
      }
    },
    fetchContactsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedContact(state, action: PayloadAction<Contact | null>) {
      state.selectedContact = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    addContactSuccess(state, action: PayloadAction<Contact>) {
      state.list.unshift(action.payload);
      state.selectedContact = action.payload;
    },
    updateContactSuccess(state, action: PayloadAction<Contact>) {
      state.list = state.list.map(c => c.id === action.payload.id ? action.payload : c);
      if (state.selectedContact?.id === action.payload.id) {
        state.selectedContact = action.payload;
      }
    },
    deleteContactSuccess(state, action: PayloadAction<number>) {
      state.list = state.list.filter(c => c.id !== action.payload);
      if (state.selectedContact?.id === action.payload) {
        state.selectedContact = null;
      }
    },
  },
});

export const {
  fetchContactsStart,
  fetchContactsSuccess,
  fetchContactsFailure,
  setSelectedContact,
  setSearchQuery,
  addContactSuccess,
  updateContactSuccess,
  deleteContactSuccess,
} = contactsSlice.actions;
export default contactsSlice.reducer;
