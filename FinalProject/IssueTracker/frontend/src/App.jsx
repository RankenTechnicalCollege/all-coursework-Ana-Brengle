import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1></h1>
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
      <div>
          <h1>User</h1>
          <ul>
            <li></li>
            <li></li>
            <li></li>
          </ul>
      </div>
      <div>
          <h1>Bugs</h1>
          <ul>
            <li>Bug 1</li>
            <li>Bug 2</li>
            <li>Bug 3</li>
            <li>Bug 4</li>
          </ul>
      </div>

      <footer style="text-align: center"> &copy; Ana Brengle 2024</footer>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
    </>
  )
}

export default App
