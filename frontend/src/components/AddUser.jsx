import React, { useState } from 'react';
import axios from 'axios';

function AddUser() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault(); // Ngăn form reload lại trang

        const newUser = { name: name, email: email };
        //Localhost--> ip may backend
        axios.post("http://192.168.1.9:3000/users", newUser)
            .then(response => {
                alert(`User added successfully with ID: ${response.data.id}`);
                // Xóa trống các ô input sau khi thêm thành công
                setName('');
                setEmail('');
            })
            .catch(error => {
                console.error('There was an error adding the user!', error);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add New User</h2>
            <div>
                <label>Name: </label>
                <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            </div>
            <div>
                <label>Email: </label>
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>
            <button type="submit">Add User</button>
        </form>
    );
}

export default AddUser;