import React from "react";
import { FaCalculator } from "react-icons/fa";

import Board from "./components/Board";
import './styles.css';
class App extends React.Component {
  constructor() {
    super();

    this.state = {
      finalState: "", 
    }
  }

  componentDidMount = () => {
    
  }

  render = () => {
    let saida = 
        <div className="color-tertiary">
          <nav class="navbar py-4 h15">
            <div class="container-fluid ">
              <h1 class="navbar-brand mb-0 fs-1 text-center w-100 text-white">8 Puzzle</h1>
            </div>
          </nav>
          

          <div className="row h85 mx-0">
            <main className="col-6">

              <div className="col-8 mx-auto mt-5 d-flex justify-content-between">
                <div class="input-group mb-3 ps-0 pe-4">
                  <input 
                    type="text" 
                    className="form-control border-0 text-white" 
                    maxLength={9} 
                    placeholder="Ex: 123046789" 
                    value={this.state.finalState}
                    onChange={ (e) => this.setState({ finalState: e.target.value}) }/>

                  <span class="input-group-text button px-3 border-0">Definir EF</span>
                </div>

                <div>
                  <i ></i>
                  <button className="button">Embaralhar</button>
                </div>
              </div>
  

              <Board finalState={this.state.finalState}/>


              <div className="d-flex justify-content-center mt-5">
                <button className="button btn-large btn"> <FaCalculator/> Resolver</button>
              </div>



            </main>

            <aside className=" col-6">
              Histórico
            </aside>
          </div>
          

        </div>

      return saida;
  }
}
 
export default App;