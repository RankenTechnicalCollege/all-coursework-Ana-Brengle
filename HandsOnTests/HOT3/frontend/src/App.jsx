
import './App.css'
function App() {
   

  return (
    <>
    <header>
        <nav className="navbar navbar-expand-lg bg-light">
          <div className="container-fluid">
            <a className="navbar-brand" href="#">Product Catalog</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#">Products</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">More Products</a>
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
                <h1><a href="api/products">Products</a></h1>
                <ul>
              <li><a href='api/products/68f15cc927761e15c1e89518'>Wireless Mouse</a></li>
              <li><a href='api/products/68f15cc927761e15c1e89519'>Bluetooth Headphones</a></li>
              <li><a href='api/products/68f15cc927761e15c1e8951a'>Running Shoes</a></li>
              <li><a href='api/products/68f15cc927761e15c1e8951b'>Coffee Maker</a></li>
            </ul>
              </div>
            </section>
          </div>
        </div>
      </main>
    <footer className="bg-dark text-white text-center py-3 mt-auto">
      <p className="mb-0">&copy; 2025 Ana Brengle</p>
    </footer>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
    </>
  )
}

export default App
