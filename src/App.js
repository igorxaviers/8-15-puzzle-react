import React from "react";
import { FaCalculator, FaRandom, FaPuzzlePiece } from "react-icons/fa";
import Board from "./components/Board";
import "./styles.css";
import Queue from "./Queue";

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      size: 9,
      initialState: "123046758",
      finalState: "",
      currentState: "123046758",
      lastState: [],
      finalStateValid: false,
      canSolve: false,
      history: [],
      qtdShuffle: 0,
      searchSelected: "BestFirst",
      timeSpend: 0,
      possiblePaths: {
        0: [1, 3],
        1: [0, 2, 4],
        2: [1, 5],
        3: [0, 4, 6],
        4: [1, 3, 5, 7],
        5: [2, 4, 8],
        6: [3, 7],
        7: [4, 6, 8],
        8: [5, 7]
      },
      possiblePaths15: {
        0: [1, 4],
        1: [0, 5, 2],
        2: [1, 6, 3],
        3: [2, 7],
        4: [0, 5, 8],
        5: [4, 1, 9, 6],
        6: [5, 2, 10, 7],
        7: [6, 3, 11],
        8: [4, 9, 12],
        9: [8, 5, 13, 10],
        10: [9, 6, 14, 11],
        11: [7, 10, 15],
        12: [8, 13],
        13: [12, 9, 14],
        14: [13, 10, 15],
        15: [14, 11]
      }
    };
  }

  componentDidMount() {
    this.setState({
      currentState: this.state.initialState
    });
  }

  sort = () => {
    this.setState({
      history: [],
      lastState: []
    });
    let possibleMoves = [];
    var i = 0;
    const interval = setInterval(() => {
      const positionEmpty = this.state.currentState.indexOf("0");
      possibleMoves = this.paths(positionEmpty);

      let positionMove = Math.floor(Math.random() * possibleMoves.length); //pegar posição aleatória do array acima
      positionMove = possibleMoves[positionMove]; //posição em que será colocada o valor "ZERO"
      const piece = this.state.currentState.charAt(positionMove); //'12[3]046758'

      let auxStr;
      auxStr = this.replaceAt(this.state.currentState, positionMove, "0"); //'123046058'
      auxStr = this.replaceAt(auxStr, positionEmpty, piece); //'123046758'

      this.setState({ currentState: auxStr });
      i++;
      this.setState({ qtdShuffle: i });
      if (i === 100) {
        clearInterval(interval);
        this.setState({
          canSolve: true,
          initialState: "816502734",
          currentState: "816502734"
        });
      }
    }, 40);
  };

  solve = () => {
    debugger;
    let timeStart = new Date().getTime();
    this.setState({
      history: []
    });
    if (this.state.searchSelected === "BestFirst") {
      let queue = new Queue();
      let achou = false;

      queue.enqueue(this.state.currentState, 0, [this.state.currentState]);
      while (!queue.isEmpty() && !achou) {
        let last = queue.dequeue();

        // last.paths.push(last.state);

        let oldHistory = this.state.history;
        oldHistory.push(last.state);
        this.setState({
          history: oldHistory
        });

        if (last.state !== this.state.finalState) {
          let children = this.generateChildren(last.state, last.paths);

          if (this.state.size === 16) children = this.calculateFA(children);
          else children = this.calculateFAManhattan(children);

          for (let child of children) {
            queue.enqueue(child.state, child.fa, child.paths);
          }
        } else {
          achou = true;
        }

        this.setState({
          currentState: last.state,
          lastState: last.paths
        });
        debugger;
      }
    } else {
      //A*
      let queue = new Queue();
      let achou = false;

      queue.enqueue(this.state.currentState, 0, []);
      while (!queue.isEmpty() && !achou) {
        let last = queue.dequeue();

        //last.paths.push(last.state);

        let oldHistory = this.state.history;
        oldHistory.push(last.state);
        this.setState({
          history: oldHistory
        });

        if (last.state !== this.state.finalState) {
          let children = this.generateChildren(last.state, last.paths);

          children = this.calculateFA(children); // + FC
          //children = this.calculateFAManhattan(children);

          for (let child of children) {
            queue.enqueue(child.state, child.fa + 1, child.paths);
          }
        } else {
          achou = true;
        }
        console.log(last);

        this.setState({
          currentState: last.state,
          lastState: last.paths
        });
      }
    }
    let timeEnd = new Date().getTime();
    let time = timeEnd - timeStart;
    let timeMin = Math.floor(time / 60000);
    let timeSec = Math.floor((time % 60000) / 1000);
    let timeMil = Math.floor((time % 60000) % 1000);
    this.setState({
      timeSpend: timeMin + ":" + timeSec + ":" + timeMil,
      canSolve: false
    });
  };

  verifyHistory(state) {
    for (let i = 0; i < this.state.history.length; i++) {
      if (this.state.history[i] === state) {
        return true;
      }
    }
    return false;
  }

  isSolvable = () => {
    let inversions = 0;
    let state = this.state.currentState;
    state = [
      [state.charAt(0), state.charAt(1), state.charAt(2)],
      [state.charAt(3), state.charAt(4), state.charAt(5)],
      [state.charAt(6), state.charAt(7), state.charAt(8)]
    ];
    for (let i = 0; i < 3; i++) {
      for (let j = i + 1; j < 3; j++) {
        if (state[j][i] > 0 && state[j][i] > 0 && state[j][i] > state[i][j]) {
          inversions++;
        }
      }
    }

    let solvable = inversions % 2 === 0;

    alert(solvable);
  };

  generateChildren(last, paths) {
    const positionEmpty = last.indexOf("0");
    let possibleMoves = this.paths(positionEmpty);

    let children = [];
    for (let pos of possibleMoves) {
      let positionMove = pos;
      const piece = last.charAt(positionMove);
      let auxStr;
      auxStr = this.replaceAt(last, positionMove, "0");
      auxStr = this.replaceAt(auxStr, positionEmpty, piece);

      if (!paths.includes(auxStr)) {
        let childPath = [...paths];
        childPath.push(auxStr);
        children.push({ state: auxStr, paths: childPath });
      }
    }

    return children;
  }

  // generateChildrenFC(last, priority, paths) {
  //   const positionEmpty = last.indexOf("0");
  //   let possibleMoves = this.paths(positionEmpty); //[0,2,3]

  //   let children = [];
  //   for (let pos of possibleMoves) {
  //     let positionMove = pos;
  //     const piece = last.charAt(positionMove);
  //     let aux;
  //     aux = this.replaceAt(last, positionMove, "0");
  //     aux = this.replaceAt(aux, positionEmpty, piece);

  //     if (!paths.includes(aux)) {
  //       let childPath = [...paths];
  //       children.push({ state: aux, priority: priority, paths: childPath });
  //     }
  //   }

  //   return children;
  // }

  calculateFA = (states) => {
    let fa;
    let aux;
    for (let i = 0; i < states.length; i++) {
      fa = 0;
      for (let j = 0; j < states[i]["state"].length; j++) {
        aux = states[i]["state"].charAt(j);
        if (aux !== "0") {
          if (states[i]["state"][j] !== this.state.finalState[j]) {
            fa++;
          }
        }
      }
      states[i].fa = fa;
    }
    return states;
  };

  calculateFAManhattan = (states) => {
    for (let i = 0; i < states.length; i++) {
      states[i].fa = this.manhattanSum(states[i]["state"]);
    }
    return states;
  };

  manhattanSum = (state) => {
    let currentStateMatrix = this.generateMatrix(state);
    let finalStateMatrix = this.generateMatrix(this.state.finalState);
    let sum = 0;

    for (let i = 0; i < currentStateMatrix.length; i++) {
      for (let j = 0; j < currentStateMatrix[i].length; j++) {
        const location = this.findNumber(
          finalStateMatrix,
          currentStateMatrix[i][j]
        );
        sum += Math.abs(i - location.i) + Math.abs(j - location.j);
      }
    }
    return sum;
  };

  findNumber(finalStateMatrix, number) {
    for (let i = 0; i < finalStateMatrix.length; i++) {
      for (let j = 0; j < finalStateMatrix[0].length; j++) {
        if (finalStateMatrix[i][j] === number) {
          return { i, j };
        }
      }
    }
  }

  generateMatrix = (stateString) => {
    let matrixSize = 0;
    let charPos = 0;

    if (this.state.size === 9) {
      matrixSize = this.state.size / 3;
    } else {
      matrixSize = this.state.size / 4;
    }
    let matrix = new Array(matrixSize);

    for (let i = 0; i < matrixSize; i++) {
      matrix[i] = new Array(matrixSize);
    }

    for (let i = 0; i < matrixSize; i++) {
      for (let j = 0; j < matrixSize; j++) {
        matrix[i][j] = stateString.charAt(charPos);
        charPos++;
      }
    }

    return matrix;
  };

  changeSize = (e) => {
    let size = parseInt(e.target.value);
    let state;
    if (size === 9) {
      state = "123046758";
    } else {
      state = "1230467589ABCEDF";
    }
    this.setState({
      size,
      currentState: state,
      initialState: state
    });
  };

  replaceAt = (string, index, replacement) => {
    return string.substr(0, index) + replacement + string.substr(index + 1);
  };

  paths = (index) => {
    if (this.state.size === 9) return this.state.possiblePaths[index];
    return this.state.possiblePaths15[index];
  };

  paths15 = (index) => {
    return this.state.possiblePaths15[index];
  };

  validateFinalState = () => {
    let count = 0;
    let sequence = "012345678";
    this.state.finalState.split("").map((piece, index) => {
      if (sequence.includes(piece)) {
        count++;
        sequence = sequence.replace(piece, "#");
      }
    });

    if (count === 9) {
      this.setState({
        finalStateValid: true
      });

      let fe = document.getElementById("txFinalState");
      fe.classList.remove("is-invalid");
      fe.classList.add("is-valid");
    } else {
      this.setState({
        finalStateValid: false,
        canSolve: false
      });

      let fe = document.getElementById("txFinalState");
      fe.classList.remove("is-valid");
      fe.classList.add("is-invalid");
    }
  };

  render = () => {
    let saida = (
      <div className="color-tertiary">
        <nav className="navbar py-4 h15">
          <div className="container-fluid d-flex align-items-center">
            <FaPuzzlePiece />
            <h1 className="navbar-brand mb-0 fs-1 text-center w-100 text-white ">
              8 Puzzle
            </h1>
          </div>
        </nav>

        <div className="row h85 mx-0">
          <main className="col-6">
            <div className="col-8 mx-auto mt-3 d-flex justify-content-between flex-wrap">
              <div className="row w-100 mb-5">
                <div className="col-6">
                  <label className="mb-2">Algoritmo utilizado</label>
                  <select
                    className="form-select border-0"
                    value={this.state.searchSelected}
                    onChange={(e) =>
                      this.setState({ searchSelected: e.target.value })
                    }
                  >
                    <option value="BestFirst">Best-First</option>
                    <option value="A*">A*</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="mb-2">Tamanho do puzzle</label>
                  <select
                    className="form-select border-0"
                    value={this.state.size}
                    onChange={(e) => this.changeSize(e)}
                  >
                    <option value="9">8 Puzzle</option>
                    <option value="16">15 Puzzle</option>
                  </select>
                </div>
              </div>

              <label className="mb-2">Definir estado final</label>
              <div className="input-group mb-3 ps-0 pe-4">
                <input
                  type="text"
                  id="txFinalState"
                  className={`form-control border-0 text-white`}
                  maxLength={this.state.size}
                  placeholder="Ex: 012345678"
                  value={this.state.finalState}
                  onChange={(e) =>
                    this.setState({ finalState: e.target.value })
                  }
                />
                <span
                  className="input-group-text button px-3 border-0"
                  onClick={() => this.validateFinalState()}
                >
                  Definir EF
                </span>
              </div>
              <div className="d-flex justify-content-center align-items-center mt-3 w-100  mb-3">
                <button
                  className="button btn-large btn me-3"
                  onClick={() => this.sort()}
                  disabled={!this.state.finalStateValid}
                >
                  <FaRandom />
                  Embaralhar
                </button>
                <button
                  className="button"
                  disabled={!this.state.finalStateValid}
                  onClick={() => this.isSolvable()}
                >
                  Solvable?
                </button>
              </div>
            </div>
            <p className="col-8 mx-auto text-white bg-text">
              Passos para embaralhar: {this.state.qtdShuffle}
            </p>

            <Board
              size={this.state.size}
              currentState={this.state.currentState}
            />

            <div className="d-flex justify-content-center mt-5">
              <button
                className="button btn-large btn x2"
                disabled={!this.state.canSolve}
                onClick={() => this.solve()}
              >
                <FaCalculator /> Resolver
              </button>
            </div>
          </main>

          <aside className="col-6">
            <h2 className="text-white text-center my-3">Histórico</h2>
            <div className="text-white">
              <p className="bg-text">
                Nós visitados: {this.state.history.length}
              </p>
              <p className="bg-text">Tempo gasto: {this.state.timeSpend}</p>
              <p className="mt-4 fs-5">
                Caminho da solução ({this.state.lastState.length} passos):
              </p>
            </div>
            <div className="history text-white row flex-wrap mx-0">
              {this.state.lastState.map((state, index) => {
                return (
                  <div className="col-6" key={index}>
                    <div className="history-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <span className="small">Passo [{index + 1}]</span>
                          <div className="history-item-state mt-3 fw-bolder">
                            {state}
                          </div>
                        </div>
                        <Board size={this.state.size} currentState={state} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    );

    return saida;
  };
}

export default App;
