import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
  fetchContactsStart,
  fetchContactsSuccess,
  fetchContactsFailure,
  setSelectedContact,
  setSearchQuery,
  addContactSuccess,
  updateContactSuccess,
  deleteContactSuccess,
} from '../redux/contactsSlice';
import type { Contact } from '../redux/contactsSlice';
import {
  getContactsAPI,
  createContactAPI,
  updateContactAPI,
  deleteContactAPI,
} from '../services/api';
import type { RootState } from '../redux/store';
import {
  Plus,
  Mail,
  Phone,
  Building,
  MapPin,
  Edit2,
  Trash2,
  X,
  PlusCircle,
  Loader2,
} from 'lucide-react';

export const ContactDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { list: contacts, selectedContact, searchQuery, loading, error } = useSelector(
    (state: RootState) => state.contacts
  );

  const filteredContacts = React.useMemo(() => {
    if (!searchQuery) return contacts;
    const query = searchQuery.toLowerCase();
    return contacts.filter((c) => {
      const fullName = `${c.first_name} ${c.last_name}`.toLowerCase();
      return fullName.includes(query);
    });
  }, [contacts, searchQuery]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingContactId, setEditingContactId] = useState<number | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
    }
  });

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchContacts(searchQuery);
    }, 200);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchContacts = async (search?: string) => {
    try {
      dispatch(fetchContactsStart());
      const data = await getContactsAPI(search);
      dispatch(fetchContactsSuccess(data));
    } catch (err: any) {
      dispatch(fetchContactsFailure(err.response?.data?.detail || 'Failed to fetch contacts.'));
    }
  };

  const handleOpenAddModal = () => {
    setModalMode('add');
    reset({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (contact: Contact) => {
    setModalMode('edit');
    setEditingContactId(contact.id);
    setValue('first_name', contact.first_name);
    setValue('last_name', contact.last_name);
    setValue('email', contact.email || '');
    setValue('phone', contact.phone || '');
    setValue('company', contact.company || '');
    setValue('address', contact.address || '');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContactId(null);
  };

  const onSubmit = async (data: any) => {
    try {
      if (modalMode === 'add') {
        const newContact = await createContactAPI(data);
        dispatch(addContactSuccess(newContact));
      } else if (modalMode === 'edit' && editingContactId) {
        const updatedContact = await updateContactAPI(editingContactId, data);
        dispatch(updateContactSuccess(updatedContact));
      }
      handleCloseModal();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'An error occurred while saving the contact.');
    }
  };

  const handleDeleteContact = async (id: number) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      try {
        await deleteContactAPI(id);
        dispatch(deleteContactSuccess(id));
      } catch (err: any) {
        alert(err.response?.data?.detail || 'Failed to delete contact.');
      }
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex min-h-[500px] select-none">
      
      <div className="w-80 border-r border-slate-200 pr-6 flex flex-col">
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-500 mb-2">
            Search contact
          </label>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-slate-400 focus:ring-1 focus:ring-slate-400/20"
          />
        </div>

        <button
          onClick={handleOpenAddModal}
          className="w-full flex items-center justify-center space-x-1.5 bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold py-2 px-4 rounded-lg border border-slate-200 text-sm transition-colors cursor-pointer mb-6"
        >
          <Plus className="w-4 h-4" />
          <span>Add contact</span>
        </button>

        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
          {loading && contacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
              <span className="text-xs">Loading contacts...</span>
            </div>
          ) : error ? (
            <div className="text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-lg p-3 text-center">
              {error}
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-center border border-dashed border-slate-200 rounded-lg p-4">
              <PlusCircle className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-xs font-semibold text-slate-500">No contacts</p>
              {!searchQuery && (
                <button
                  onClick={handleOpenAddModal}
                  className="mt-2 text-xs font-semibold text-blue-600 hover:underline"
                >
                  Create new
                </button>
              )}
            </div>
          ) : (
            filteredContacts.map((contact) => {
              const isSelected = selectedContact?.id === contact.id;
              return (
                <div
                  key={contact.id}
                  onClick={() => dispatch(setSelectedContact(contact))}
                  className={`flex items-center px-4 py-2.5 rounded-lg transition-colors cursor-pointer text-sm font-medium ${
                    isSelected
                      ? 'bg-blue-100 text-blue-800'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{contact.first_name} {contact.last_name}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="flex-1 pl-6 flex flex-col">
        <h3 className="text-slate-800 text-sm font-semibold mb-4">
          Contact details
        </h3>

        {selectedContact ? (
          <div className="border border-slate-200 rounded-xl p-6 bg-white flex flex-col flex-1">
            
            <div className="flex items-center space-x-4 pb-5 border-b border-slate-100 mb-5">
              <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-lg font-bold uppercase shrink-0">
                {selectedContact.first_name[0]}
                {selectedContact.last_name[0]}
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  {selectedContact.first_name} {selectedContact.last_name}
                </h4>
                <p className="text-xs text-slate-400 font-medium">Contact</p>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              <div className="flex items-start text-sm">
                <span className="w-24 text-slate-500 font-semibold flex items-center space-x-1.5">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Email</span>
                </span>
                <span className="text-slate-750 font-medium truncate max-w-md">
                  {selectedContact.email || '—'}
                </span>
              </div>

              <div className="flex items-start text-sm">
                <span className="w-24 text-slate-500 font-semibold flex items-center space-x-1.5">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Phone</span>
                </span>
                <span className="text-slate-750 font-medium">
                  {selectedContact.phone || '—'}
                </span>
              </div>

              <div className="flex items-start text-sm">
                <span className="w-24 text-slate-500 font-semibold flex items-center space-x-1.5">
                  <Building className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Company</span>
                </span>
                <span className="text-slate-750 font-medium truncate">
                  {selectedContact.company || '—'}
                </span>
              </div>

              <div className="flex items-start text-sm">
                <span className="w-24 text-slate-500 font-semibold flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>Address</span>
                </span>
                <span className="text-slate-750 font-medium max-w-md leading-relaxed whitespace-pre-line">
                  {selectedContact.address || '—'}
                </span>
              </div>
            </div>

            <div className="flex space-x-3 pt-6 border-t border-slate-100 mt-6">
              <button
                onClick={() => handleOpenEditModal(selectedContact)}
                className="flex items-center space-x-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-lg border border-slate-200 text-xs transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDeleteContact(selectedContact.id)}
                className="flex items-center space-x-1.5 px-4 py-2 bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 font-semibold rounded-lg border border-rose-200 hover:border-rose-350 text-xs transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>

          </div>
        ) : (
          <div className="border border-dashed border-slate-200 rounded-xl p-8 bg-slate-50/50 flex flex-col items-center justify-center text-center text-slate-400 flex-1">
            <PlusCircle className="w-8 h-8 text-slate-350 mb-2" />
            <p className="text-xs font-semibold text-slate-500">No contact selected</p>
            <p className="text-[10px] text-slate-400 mt-1 max-w-[180px]">
              Select a contact from the sidebar list to see profile fields.
            </p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-base font-bold text-slate-900 text-center mb-6">
              {modalMode === 'add' ? 'Add new contact' : 'Edit contact'}
            </h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">First name</label>
                  <input
                    type="text"
                    placeholder="Jane"
                    className={`w-full rounded-lg border bg-white p-2 text-sm text-slate-800 outline-none transition-all ${
                      errors.first_name ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 focus:border-slate-400'
                    }`}
                    {...register('first_name', { required: 'First name is required' })}
                  />
                  {errors.first_name && <span className="text-xs text-rose-500 mt-1 block">{errors.first_name.message}</span>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Last name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    className={`w-full rounded-lg border bg-white p-2 text-sm text-slate-800 outline-none transition-all ${
                      errors.last_name ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 focus:border-slate-400'
                    }`}
                    {...register('last_name', { required: 'Last name is required' })}
                  />
                  {errors.last_name && <span className="text-xs text-rose-500 mt-1 block">{errors.last_name.message}</span>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
                <input
                  type="email"
                  placeholder="jane.doe@email.com"
                  className={`w-full rounded-lg border bg-white p-2 text-sm text-slate-800 outline-none transition-all ${
                    errors.email ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 focus:border-slate-400'
                  }`}
                  {...register('email', {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
                {errors.email && <span className="text-xs text-rose-500 mt-1 block">{errors.email.message}</span>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Phone</label>
                <input
                  type="text"
                  placeholder="+1 (415) 555-0172"
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-800 outline-none transition-all focus:border-slate-400"
                  {...register('phone')}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Company</label>
                <input
                  type="text"
                  placeholder="Acme Corp"
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-800 outline-none transition-all focus:border-slate-400"
                  {...register('company')}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Address</label>
                <textarea
                  placeholder="123 Main St, Vadodara, Gujarat"
                  rows={2}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-sm text-slate-800 outline-none transition-all focus:border-slate-400 resize-none"
                  {...register('address')}
                />
              </div>

              <div className="flex flex-col space-y-2 pt-2">
                <button
                  type="submit"
                  className="w-full py-2 bg-black hover:bg-slate-900 active:bg-slate-950 text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer text-center"
                >
                  {modalMode === 'add' ? 'Save contact' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-full py-2 bg-white hover:bg-slate-50 text-slate-500 font-semibold rounded-lg text-sm transition-colors cursor-pointer text-center"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
