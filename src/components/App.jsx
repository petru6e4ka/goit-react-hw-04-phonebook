import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ContactForm } from './ContactForm';
import { Filter } from './Filter';
import { ContactList } from './ContactList';
import { BlockContainer } from './styles';
import { nanoid } from 'nanoid';
import { contacts as storage } from 'service/storage';

export const App = () => {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const createdContacts = storage.get();

    if (createdContacts) {
      setContacts(createdContacts);
    }
  }, []);

  const ref = useRef(contacts);

  useEffect(() => {
    if (!contacts.length) {
      storage.remove();
      return;
    }

    if (contacts.length !== ref.current.length) {
      ref.current = contacts;
      storage.set(contacts);
    }
  }, [contacts]);

  const handleAddingContact = useCallback(
    evt => {
      evt.preventDefault();

      if (!evt.target.checkValidity()) {
        return;
      }

      if (contacts.find(elem => elem.name === name)) {
        alert(`${name} is already in contacts`);
        setName('');
        setNumber('');
        return;
      }

      setContacts([...contacts, { name, id: nanoid(), number }]);
      setName('');
      setNumber('');
    },
    [contacts, name, number, setName, setNumber, setContacts]
  );

  const handleNameChange = useCallback(
    evt => {
      setName(evt.target.value);
    },
    [setName]
  );

  const handleNumberChange = useCallback(
    evt => {
      setNumber(evt.target.value);
    },
    [setNumber]
  );

  const handleFilterChange = useCallback(
    evt => {
      setFilter(evt.target.value);
    },
    [setFilter]
  );

  const deleteContact = useCallback(
    evt => {
      setContacts(contacts.filter(elem => elem.id !== evt.target.value));
    },
    [setContacts, contacts]
  );

  const filterContacts = useMemo(
    () =>
      contacts.filter(contact =>
        contact.name.toLowerCase().includes(filter.toLowerCase())
      ),
    [contacts, filter]
  );

  return (
    <BlockContainer>
      <h1>Phonebook</h1>
      <ContactForm
        name={name}
        number={number}
        handleAddingContact={handleAddingContact}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />

      <h2>Contacts</h2>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <ContactList contacts={filterContacts} deleteContact={deleteContact} />
    </BlockContainer>
  );
};
