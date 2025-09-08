//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'

import './App.css'
import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [bugs, setBugs] = useState([]);

  useEffect(() => {
    // Fetch users
    fetch("https://issuetracker-service-1029534851049.us-central1.run.app/api/user/list")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));

    // Fetch bugs
    fetch("http://localhost:2026/api/bug/list")
      .then((res) => res.json())
      .then((data) => setBugs(data))
      .catch((err) => console.error("Error fetching bugs:", err))
      
  }, []);

  return (
    <>
      <header>
        <nav class="navbar navbar-expand-lg bg-light">
          <div class="container-fluid">
            <a class="navbar-brand" href="#">Issue Tracker</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
              <ul class="navbar-nav">
                <li class="nav-item">
                  <a class="nav-link active" aria-current="page" href="#">Users</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">Bugs</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <main className="container d-flex justify-content-evenly mt-4">
        {/* Users section */}
        <div className="d-flex justify-content-center border border-dark border-5  rounded-bottom px-5">
          <div className="vstack">
            <h1>Users</h1>
            <ul>
              {users.map((user) => (
                <li key={user.userId}>
                  {users.givenName} {users.familyName} — {users.role}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bugs section */}
        <div className="d-flex justify-content-center border border-dark border-5 rounded-bottom px-5">
          <div className="vstack">
            <h1>Bugs</h1>
            <ul>
              {bugs.map((bug) => (
                <li key={bug.id}>
                  {bug.title} — {bug.description}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <footer className='bg-light text-center py-3'> &copy; Ana Brengle 2024</footer>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
    </>
  )
}

export default App
