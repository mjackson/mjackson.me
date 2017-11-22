import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import "./styles.css"

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route
        path="/"
        render={() => (
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <div style={{ width: "100%" }}>
              <h1>Hello.</h1>
            </div>
          </div>
        )}
      />
    </Switch>
  </BrowserRouter>
)

ReactDOM.render(<App />, document.body)
