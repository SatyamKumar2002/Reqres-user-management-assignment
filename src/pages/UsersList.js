import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [editedUser, setEditedUser] = useState({ first_name: "", last_name: "", email: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/users");
    }
    fetchUsers(page);
  }, [page]);

  const fetchUsers = async (page) => {
    try {
      const response = await axios.get(`https://reqres.in/api/users?page=${page}`);
      setUsers(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Handle Edit
  const handleEditClick = (user) => {
    setEditingUser(user.id);
    setEditedUser({ first_name: user.first_name, last_name: user.last_name, email: user.email });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`https://reqres.in/api/users/${editingUser}`, editedUser);
      setUsers(users.map((user) => (user.id === editingUser ? { ...user, ...editedUser } : user)));
      setEditingUser(null);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://reqres.in/api/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4 text-center">User List</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {users.map((user) => (
          <div key={user.id} className="bg-white p-4 shadow-md rounded-lg">
            <div className="flex items-center">
              <img src={user.avatar} alt={user.first_name} className="w-16 h-16 rounded-full mr-4" />
              <div>
                <p className="font-bold">{user.first_name} {user.last_name}</p>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-between">
              <button 
                onClick={() => handleEditClick(user)}
                className="px-3 py-1 bg-green-500 text-white rounded"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(user.id)}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Form Modal */}
      {editingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <input 
              type="text" 
              value={editedUser.first_name} 
              onChange={(e) => setEditedUser({ ...editedUser, first_name: e.target.value })} 
              className="w-full p-2 mb-2 border rounded"
            />
            <input 
              type="text" 
              value={editedUser.last_name} 
              onChange={(e) => setEditedUser({ ...editedUser, last_name: e.target.value })} 
              className="w-full p-2 mb-2 border rounded"
            />
            <input 
              type="email" 
              value={editedUser.email} 
              onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })} 
              className="w-full p-2 mb-4 border rounded"
            />
            <div className="flex justify-between">
              <button 
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Update
              </button>
              <button 
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button 
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))} 
          disabled={page === 1} 
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 mr-2"
        >
          Previous
        </button>
        <span className="px-4 py-2">Page {page} of {totalPages}</span>
        <button 
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} 
          disabled={page === totalPages} 
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 ml-2"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UsersList;




// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const UsersList = () => {
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/users");
//     }
//     fetchUsers(page);
//   }, [page]);

//   const fetchUsers = async (page) => {
//     try {
//       const response = await axios.get(`https://reqres.in/api/users?page=${page}`);
//       setUsers(response.data.data);
//       setFilteredUsers(response.data.data);
//       setTotalPages(response.data.total_pages);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   };

//   // Search and Filter Users
//   useEffect(() => {
//     const filtered = users.filter((user) =>
//       `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredUsers(filtered);
//   }, [searchTerm, users]);

//   return (
//     <div className="p-8">
//       <h2 className="text-2xl font-bold mb-4 text-center">User List</h2>

//       {/* Search Bar */}
//       <input
//         type="text"
//         placeholder="Search by name or email..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="w-full p-2 mb-10 border rounded"
//       />

//       {/* User List */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {filteredUsers.length > 0 ? (
//           filteredUsers.map((user) => (
//             <div key={user.id} className="bg-white p-4 shadow-md rounded-lg">
//               <div className="flex items-center">
//                 <img src={user.avatar} alt={user.first_name} className="w-16 h-16 rounded-full mr-4" />
//                 <div>
//                   <p className="font-bold">{user.first_name} {user.last_name}</p>
//                   <p className="text-gray-500">{user.email}</p>
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-center text-gray-500">No users found.</p>
//         )}
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-center mt-10">
//         <button 
//           onClick={() => setPage((prev) => Math.max(prev - 1, 1))} 
//           disabled={page === 1} 
//           className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 mr-2"
//         >
//           Previous
//         </button>
//         <span className="px-4 py-2">Page {page} of {totalPages}</span>
//         <button 
//           onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} 
//           disabled={page === totalPages} 
//           className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 ml-2"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default UsersList;




