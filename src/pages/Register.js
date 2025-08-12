import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: username,
        photoURL: photoURL || "https://via.placeholder.com/100"
      });
      navigate("/account");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input className="form-control mb-3" type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
        <input className="form-control mb-3" type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <input className="form-control mb-3" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <input className="form-control mb-3" type="text" placeholder="Photo URL (optional)" onChange={(e) => setPhotoURL(e.target.value)} />
        <button className="btn btn-primary w-100">Register</button>
      </form>
    </div>
  );
}
