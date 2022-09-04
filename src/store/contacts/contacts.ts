import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { AppDispatch, RootState } from '..';
import { APIRoute, AppRoute } from '../../const';
import { Contact, NewContact } from '../../types/contact';

interface ContactsState {
  contacts: Contact[];
  isLoading: boolean;
  isError: boolean;
}

export const fetchContacts = createAsyncThunk<
Contact[],
undefined,
{
  dispatch: AppDispatch;
  state: RootState;
  extra: AxiosInstance;
}
  >(
    'contacts/fetchContacts',
    async (_, { dispatch, extra: api }) => {
      try {
        const { data } = await api.get<Contact[]>(AppRoute.Contacts);

        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  );

export const sendNewContact = createAsyncThunk<
  NewContact,
  NewContact,
  {
    dispatch: AppDispatch;
    state: RootState;
    extra: AxiosInstance;
  }
>(
  'data/sendNewContact',
  async (
    {
      name, company, phone,
    }: NewContact,
    { dispatch, extra: api },
  ) => {
    try {
      const { data } = await api.post<Contact>(APIRoute.Contacts, {
        name,
        company,
        phone,
      });

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
);

const initialState: ContactsState = {
  contacts: [],
  isLoading: false,
  isError: false,
};

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contacts = action.payload;
      })
      .addCase(fetchContacts.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default contactsSlice.reducer;
