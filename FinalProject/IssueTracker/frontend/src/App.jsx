import { useState, useEffect } from 'react'
import axios from 'axios'

import './App.css'



function App() {

  const [users, setUsers] = useState([])
    useEffect(() => {
      const fetchUsers = async () => {
        const response = await axios.get('http://localhost:8080/api/')
        setUsers(response.data)
      }

      fetchUsers
    }, [])
  
  return (
    <>
      {/* <header>
        <nav className="navbar navbar-expand-lg bg-light">
          <div className="container-fluid">
            <a className="navbar-brand" href="#">Issue Tracker</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#">Users</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">Bugs</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      <main className="container d-flex justify-content-evenly mt-4">
      <div className='container'>
        <div className='row'>
          <section className='col-md-6'>
          <div className='col-12'>
            <h1><a href='api/users/list'>Users</a></h1>
            <ul>
              <li><a href='api/users/1'>Nina</a></li>
              <li><a href='api/users/2'>Ryan</a></li>
              <li><a href='api/users/3'>Lisa</a></li>
              <li><a href='api/users/4'>David</a></li>
            </ul>
          </div>
          </section>
          <section className='col-md-6'>
            <div className="col-6">
              <h1><a href="api/bugs/list">Bugs</a></h1>
              <ul>
                <li><a href="api/bugs/1">Login button not responsive</a></li>
                <li><a href="api/bugs/2">Page crashes on form submission</a></li>
                <li><a href="api/bugs/3">Incorrect total price in cart</a></li>
                <li><a href="api/bugs/4">Notification emails not sent</a></li>
              </ul>
            </div>
          </section>
        </div>
      </div>
      </main>
      <footer className='bg-light text-center py-3'> &copy; Ana Brengle 2024</footer> */}
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
    </>
  )
}

export default App
